/**
 * Combine event listeners and handle events in order for each listener
 */
import { SubscribeAwareEventListener } from './EventListener';
import { DomainEventStream } from '../Domain/DomainEventStream';
import {eventListenersDomainEvents, subscribeByOfEventListener} from './index';
import { concatMap } from 'rxjs/operators';
import { flatten } from 'lodash';
import { EventListener } from './EventListener';
import {of} from "rxjs";

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
          await of(message).pipe(subscribeByOfEventListener(listener)).toPromise();
        }
        return message;
      })
    );
  };
}
