/**
 * Combine event listeners and handle events in order for each listener
 */
import { SubscribeAwareEventListener } from './EventListener';
import { DomainEventStream } from '../Domain/DomainEventStream';
import { eventListenersDomainEvents } from './index';
import { concatMap } from 'rxjs/operators';
import { handleByDecoratedHandlers } from './reactive/operators/handleByDecoratedHandlers';
import { flatten } from 'lodash';
import { EventListener } from './EventListener';

export class SequentialEventListenerCollection implements EventListener, SubscribeAwareEventListener {

  constructor(protected listeners: EventListener[]) {

  }

  public getListeners(): EventListener[] {
    return this.listeners;
  }

  public listenTo = () => {
    return flatten(this.listeners.map((lister) => eventListenersDomainEvents(lister)));
  };

  public subscribeBy = (events: DomainEventStream): DomainEventStream => {
    return events.pipe(
      concatMap(async (message) => {
        for (const listener of this.listeners) {
          await handleByDecoratedHandlers(listener)(message);
        }
        return message;
      })
    );
  };
}
