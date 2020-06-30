import { DomainEventStream } from '../Domain/DomainEventStream';
import { EventListener } from './EventListener';
import { concatMap, share } from 'rxjs/operators';
import { merge } from 'rxjs';
import { filterByDomainEventConstructor } from './reactive/operators/filterByDomainEventConstructor';
import { flatten, memoize } from 'lodash';
import { splitBy } from 'rxjs-etc/operators';
import { DomainMessage } from '../Domain/DomainMessage';
import { eventListenersDomainEvents, subscribeByOfEventListener } from './index';

/**
 * Combine event listeners.
 */
export class EventListenerCollection implements EventListener {

  constructor(protected listeners: EventListener[]) {

  }

  public getListeners(): EventListener[] {
    return this.listeners;
  }

  public listenTo = memoize(() => {
    return flatten(this.listeners.map((lister) => eventListenersDomainEvents(lister)));
  });

  public subscribeBy = (events: DomainEventStream): DomainEventStream => {
    const operators: ((input: DomainEventStream) => DomainEventStream)[] = this.listeners.map((listener) => (input) => input.pipe(
      filterByDomainEventConstructor(eventListenersDomainEvents(listener)),
      subscribeByOfEventListener(listener),
    ));
    const listenTo = this.listenTo();
    return events.pipe(
      share(),
      splitBy((message: DomainMessage) => listenTo.includes((message.payload as any).constructor)),
      concatMap(([filtered, rest]) => merge(rest, ...operators.map((operator) => operator(filtered)))),
    );
  };
}
