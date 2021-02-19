import { DomainEventConstructor } from '../Domain/DomainEvent';
import { filterByDecoratedHandlers } from './reactive/operators/filterByDecoratedHandlers';
import { DomainEventStream } from '../Domain/DomainEventStream';
import { concatMap } from 'rxjs/operators';
import { handleByDecoratedHandlers } from './reactive/operators/handleByDecoratedHandlers';
import { SubscribeAwareEventListener } from './EventListener';
import {HandlerMonitor} from "./HandlerMonitorEvent";

export const eventListenersDomainEvents = (listener: SubscribeAwareEventListener): DomainEventConstructor[] => {
  if (!listener.listenTo) {
    listener.listenTo = filterByDecoratedHandlers(listener);
  }
  return listener.listenTo();
};

export const subscribeByOfEventListener = (listener: SubscribeAwareEventListener, monitor: HandlerMonitor): (events: DomainEventStream) => DomainEventStream => {
  if (!listener.subscribeBy) {
    listener.subscribeBy = (input) => input.pipe(concatMap(handleByDecoratedHandlers(listener, monitor)));
  }
  return listener.subscribeBy;
};
