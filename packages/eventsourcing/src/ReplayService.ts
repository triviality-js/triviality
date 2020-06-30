import { Subject } from 'rxjs';
import { EventStore } from './EventStore/EventStore';
import { EventBus } from './EventHandling/EventBus';
import { SimpleDomainEventStream } from './Domain/SimpleDomainEventStream';
import { DomainMessage } from './Domain/DomainMessage';
import { IdleAwareEventBus } from './EventHandling/IdleAwareEventBus';

export class ReplayService {

  constructor(private readonly eventStore: EventStore,
              private readonly messageBus: EventBus | IdleAwareEventBus) {
  }

  public async replay(): Promise<void> {
    await new Promise<void>((accept, reject) => {
      const subject = new Subject<DomainMessage>();
      this.messageBus.publish(new SimpleDomainEventStream(subject));
      const stream = this.eventStore.loadAll();
      stream.subscribe(subject.next.bind(subject), reject, () => {
        subject.complete();
        accept();
      });
    });
    if ((this.messageBus as IdleAwareEventBus).untilIdle) {
      await (this.messageBus as IdleAwareEventBus).untilIdle();
    }
  }

}
