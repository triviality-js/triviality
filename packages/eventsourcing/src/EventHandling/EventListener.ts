import { DomainEventStream } from '../Domain/DomainEventStream';
import { DomainEventConstructor } from '../Domain/DomainEvent';

export type ListenTo = (events: DomainEventStream, timout?: number) => DomainEventStream;

/**
 * Handles dispatched events.
 */
export interface EventListener {

}

export interface SubscribeAwareEventListener extends EventListener {
  /**
   * When nothing is subscribed, filterByDecoratedHandlers will automatically be configured.
   *
   * events.pipe(filterByDecoratedHandlers(eventListener)).
   */
  listenTo?: () => DomainEventConstructor[];
  /**
   *
   * When nothing is defined, handleByDecoratedHandlers will automatically be configured.
   *
   * events.pipe(concatMap(handleByDecoratedHandlers(listener)))
   *
   * Keep in mind all events should be returned where is listenTo, or the streams should be completed.
   *
   * Example handle multiple events synchronously inside this projector.
   *
   * public subscribeBy = (events: DomainEventStream): DomainEventStream => {
   *   return events.pipe(
   *     bucketBy(8, (event) => hash(event.aggregateId)),
   *     concatMap((inputs: DomainEventStream[]) =>
   *       merge(...inputs.map((input) => {
   *         return input.pipe(concatMap(handleByDecoratedHandlers(this)))
   *       }))
   *     ),
   *   );
   * }
   */
  subscribeBy?: (events: DomainEventStream) => DomainEventStream;
}

export type EventListenerConstructor = new(...args: any[]) => EventListener;
