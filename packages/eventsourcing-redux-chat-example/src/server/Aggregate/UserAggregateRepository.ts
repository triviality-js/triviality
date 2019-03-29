import { DomainEventStreamDecorator } from '@triviality/eventsourcing/Domain/DomainEventStreamDecorator';
import { DomainEventBus } from '@triviality/eventsourcing/EventHandling/DomainEventBus';
import { EventSourcingRepositoryInterface } from '@triviality/eventsourcing/EventSourcing/EventSourcingRepositoryInterface';
import { SimpleEventSourcedAggregateFactory } from '@triviality/eventsourcing/EventSourcing/Factory/SimpleEventSourcedAggregateFactory';
import { CachedEventSourcingRepositoryDecorator } from '@triviality/eventsourcing/EventSourcing/Repository/CachedEventSourcingRepositoryDecorator';
import { EventSourcingRepository } from '@triviality/eventsourcing/EventSourcing/Repository/EventSourcingRepository';
import { EventStore } from '@triviality/eventsourcing/EventStore/EventStore';
import { UserId } from '../../shared/ValueObject/UserId';
import { UserAggregate } from './UserAggregate';

export class UserAggregateRepository implements EventSourcingRepositoryInterface<UserAggregate, UserId> {

  private readonly repository: EventSourcingRepositoryInterface<UserAggregate>;

  constructor(eventStore: EventStore,
              eventBus: DomainEventBus,
              streamDecorator?: DomainEventStreamDecorator) {
    // Used competition instead of inheritance here, pick your thing.
    const factory = new SimpleEventSourcedAggregateFactory(UserAggregate);
    this.repository = new EventSourcingRepository(eventStore, eventBus, factory, streamDecorator);
    this.repository = new CachedEventSourcingRepositoryDecorator(this.repository);
  }

  public async has(id: UserId): Promise<boolean> {
    return this.repository.has(id);
  }

  public load(id: UserId): Promise<UserAggregate> {
    return this.repository.load(id);
  }

  public save(aggregate: UserAggregate): Promise<void> {
    return this.repository.save(aggregate);
  }
}
