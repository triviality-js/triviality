import { UserAggregate } from './UserAggregate';
import { UserId } from '../../shared/ValueObject/UserId';
import { EventStore } from 'ts-eventsourcing/EventStore/EventStore';
import { DomainEventBus } from 'ts-eventsourcing/EventHandling/DomainEventBus';
import { SimpleEventSourcedAggregateFactory } from 'ts-eventsourcing/EventSourcing/Factory/SimpleEventSourcedAggregateFactory';
import { EventSourcingRepositoryInterface } from 'ts-eventsourcing/EventSourcing/EventSourcingRepositoryInterface';
import { DomainEventStreamDecorator } from 'ts-eventsourcing/Domain/DomainEventStreamDecorator';
import { CachedEventSourcingRepositoryDecorator } from 'ts-eventsourcing/EventSourcing/Repository/CachedEventSourcingRepositoryDecorator';
import { EventSourcingRepository } from 'ts-eventsourcing/EventSourcing/Repository/EventSourcingRepository';

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
