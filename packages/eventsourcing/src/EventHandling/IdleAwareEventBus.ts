import { EventBus } from './EventBus';
import { DomainEventStream } from '../Domain/DomainEventStream';

export interface IdleAwareEventBus extends EventBus {
  /**
   * Until all events are idle.
   */
  untilIdle(): Promise<void>;
  /**
   * Knows when events happend.
   */
  publishSync(stream: DomainEventStream): Promise<void>;
}
