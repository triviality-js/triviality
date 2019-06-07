import { Metadata } from '@triviality/eventsourcing/Metadata';
import { ActionsObservable } from 'redux-observable';
import { Observable, throwError } from 'rxjs';
import { RunHelpers } from 'rxjs/internal/testing/TestScheduler';
import { TestScheduler } from 'rxjs/testing';
import { SerializableAction } from '../../../Redux/SerializableAction';
import { gatewayClose, gatewayError, gatewayIsClosed, gatewayIsOpen, gatewayOpen } from '../../actions';
import { GatewayAction } from '../../GatewayAction';
import { gatewayEpic } from '../gatewayEpic';

function run<T>(callback: (helpers: RunHelpers) => T): T {
  const scheduler = new TestScheduler((actual, expected) => {
    expect(actual).toStrictEqual(expected);
  });
  return scheduler.run(callback);
}

const createDummyAction = (id: string) => ({
  [id]: {
    type: `Action ${id}`,
    metadata: {
      entity: `entity ${id}`,
    },
  },
});

it('Should listen to client action', () => run(({ expectObservable, cold }) => {
  const socketActions: { [key: string]: GatewayAction<string> } = {
    o: gatewayOpen('account', '/account'),
    c: gatewayClose('account', '/account'),
  };
  const clientActions: { [key: string]: SerializableAction } = {
    ...createDummyAction('a'),
    ...createDummyAction('b'),
  };
  const clients: (gate: string, metadata: Metadata) => Observable<SerializableAction> = () => {
    return cold('-ab', clientActions);
  };
  const stream = gatewayEpic(clients)(new ActionsObservable(cold('o--c|', socketActions)));

  const socketStatusActions: { [key: string]: GatewayAction<string> } = {
    o: gatewayIsOpen('account', '/account'),
    c: gatewayIsClosed('account', '/account'),
  };
  expectObservable(stream).toBe('oabc|', { ...clientActions, ...socketStatusActions });
}));

it('Should listen to multiple clients action', () => run(({ expectObservable, cold }) => {
  const socketActions: { [key: string]: GatewayAction<string> } = {
    a: gatewayOpen('account', '/account'),
    b: gatewayClose('account', '/account'),
    1: gatewayOpen('chat', '/chat'),
    2: gatewayClose('chat', '/chat'),
  };
  const clientActions: { [key: string]: SerializableAction } = {
    ...createDummyAction('6'),
    ...createDummyAction('7'),
    ...createDummyAction('8'),
    ...createDummyAction('9'),
  };
  const clients: (gate: string, metadata: Metadata) => Observable<SerializableAction> = (gate) => {
    if (gate === '/account') {
      return cold('6 500ms 7', clientActions);
    }
    if (gate === '/chat') {
      return cold('8 100ms 9', clientActions);
    }
    return throwError('Does not exists');
  };
  const stream = gatewayEpic(clients)(new ActionsObservable(cold('(a1) 1000ms b2|', socketActions)));

  const socketStatusActions: { [key: string]: GatewayAction<string> } = {
    a: gatewayIsOpen('account', '/account'),
    b: gatewayIsClosed('account', '/account'),
    1: gatewayIsOpen('chat', '/chat'),
    2: gatewayIsClosed('chat', '/chat'),
  };
  expectObservable(stream).toBe('(a168) 95ms 9 399ms 7 502ms b2|', { ...clientActions, ...socketStatusActions });
}));

it('Should be able to close single client early', () => run(({ expectObservable, cold }) => {
  const socketActions: { [key: string]: GatewayAction<string> } = {
    a: gatewayOpen('account', '/account'),
    b: gatewayClose('account', '/account'),
    1: gatewayOpen('chat', '/chat'),
    2: gatewayClose('chat', '/chat'),
  };
  const clientActions: { [key: string]: SerializableAction } = {
    ...createDummyAction('6'),
    ...createDummyAction('7'),
    ...createDummyAction('8'),
    ...createDummyAction('9'),
  };
  const clients: (gate: string, metadata: Metadata) => Observable<SerializableAction> = (gate) => {
    if (gate === '/account') {
      return cold('6 500ms 7', clientActions);
    }
    if (gate === '/chat') {
      return cold('8 100ms 9', clientActions);
    }
    return throwError('Does not exists');
  };
  const stream = gatewayEpic(clients)(new ActionsObservable(cold('(a1) 200ms 2 800ms b|', socketActions)));

  const socketStatusActions: { [key: string]: GatewayAction<string> } = {
    a: gatewayIsOpen('account', '/account'),
    b: gatewayIsClosed('account', '/account'),
    1: gatewayIsOpen('chat', '/chat'),
    2: gatewayIsClosed('chat', '/chat'),
  };
  expectObservable(stream).toBe('(a168) 95ms ( 9 100ms ) ( 2 294ms ) ( 7 501ms ) b|', { ...clientActions, ...socketStatusActions });
}));

it('Should handle error gracefully', () => run(({ expectObservable, cold, hot }) => {
  const socketActions: { [key: string]: GatewayAction<string> } = {
    o: gatewayOpen('account', '/account'),
    c: gatewayClose('account', '/account'),
  };
  const clientActions: { [key: string]: SerializableAction } = {
    ...createDummyAction('a'),
    ...createDummyAction('b'),
  };
  const clientStreamError = hot('--a#b', clientActions);
  const clientStream = hot('------b', clientActions);
  const clients: (gate: string, metadata: Metadata) => Observable<SerializableAction> = jest.fn()
    .mockReturnValueOnce(clientStreamError)
    .mockReturnValueOnce(clientStream);
  const stream = gatewayEpic(clients)(new ActionsObservable(cold('o------c|', socketActions)));

  const socketStatusActions: { [key: string]: GatewayAction<string> } = {
    o: gatewayIsOpen('account', '/account'),
    c: gatewayIsClosed('account', '/account'),
    e: gatewayError('account', '/account', 'error'),
  };
  expectObservable(stream).toBe('o-ae--bc|', { ...clientActions, ...socketStatusActions });
}));
