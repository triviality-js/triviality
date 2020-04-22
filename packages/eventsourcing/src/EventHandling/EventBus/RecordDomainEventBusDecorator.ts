/**
 * Simple synchronous publishing of events.
 */
import { EventBus } from '../EventBus';
import { EventListener } from '../EventListener';
import { DomainMessage } from '../../Domain/DomainMessage';
import { DomainEventStream } from '../../Domain/DomainEventStream';
import { tap } from 'rxjs/operators';

/**
 * For recording messages that are put on the bus.
 *
 * Currently only used for testing purposes.
 */
export class RecordDomainEventBusDecorator implements EventBus {

  private messages: DomainMessage[] = [];

  constructor(private bus: EventBus) {

  }

  public subscribe(eventListener: EventListener): void {
    this.bus.subscribe(eventListener);
  }

  public publish(stream: DomainEventStream): void {
    this.bus.publish(stream.pipe(tap((message: DomainMessage) => {
      this.messages.push(message);
    })));
  }

  public getMessages(): DomainMessage[] {
    return this.messages;
  }

}
