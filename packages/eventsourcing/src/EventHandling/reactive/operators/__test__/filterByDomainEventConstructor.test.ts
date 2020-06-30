/* tslint:disable */

import { filterByDomainEventConstructor } from '../filterByDomainEventConstructor';
import { DomainEvent } from '../../../../Domain/DomainEvent';
import { of } from 'rxjs';
import { DomainMessage } from '../../../../Domain/DomainMessage';
import { toArray } from 'rxjs/operators';

class Event1 implements DomainEvent {
  constructor(public value: number) {}
}

class Event2 implements DomainEvent {
  constructor(public value: number) {}
}

it('Can filter event', async () => {

  expect(await of(
      {
        payload: new Event1(1),
      } as DomainMessage<Event1>,
      {
        payload: new Event2(2),
      } as DomainMessage<Event2>,
  ).pipe(filterByDomainEventConstructor([Event1]), toArray()).toPromise()).toEqual([
    {
      payload: new Event1(1),
    },
  ]);

});

it('Can filter events', async () => {

  expect(await of(
      {
        payload: new Event2(3),
      } as DomainMessage<Event2>,
      {
        payload: new Event1(1),
      } as DomainMessage<Event1>,
      {
        payload: new Event2(4),
      } as DomainMessage<Event2>,
      {
        payload: new Event1(2),
      } as DomainMessage<Event1>,
  ).pipe(filterByDomainEventConstructor([Event1]), toArray()).toPromise()).toEqual([
      {
        payload: new Event1(1),
      } as DomainMessage<Event1>, {
      payload: new Event1(2),
    },
  ]);

});
