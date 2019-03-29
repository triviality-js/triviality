import { DomainEventStreamDecorator } from '@triviality/eventsourcing/Domain/DomainEventStreamDecorator';
import { DomainEventBus } from '@triviality/eventsourcing/EventHandling/DomainEventBus';
import { EventSourcingRepositoryInterface } from '@triviality/eventsourcing/EventSourcing/EventSourcingRepositoryInterface';
import { SimpleEventSourcedAggregateFactory } from '@triviality/eventsourcing/EventSourcing/Factory/SimpleEventSourcedAggregateFactory';
import { CachedEventSourcingRepositoryDecorator } from '@triviality/eventsourcing/EventSourcing/Repository/CachedEventSourcingRepositoryDecorator';
import { EventSourcingRepository } from '@triviality/eventsourcing/EventSourcing/Repository/EventSourcingRepository';
import { EventStore } from '@triviality/eventsourcing/EventStore/EventStore';
import { ChatChannelId } from '../../shared/ValueObject/ChatChannelId';
import { UserId } from '../../shared/ValueObject/UserId';
import { ChatChannelAggregate } from './ChatChannelAggregate';

export class ChatChannelAggregateRepository implements EventSourcingRepositoryInterface<ChatChannelAggregate, ChatChannelId> {

  private readonly repository: EventSourcingRepositoryInterface<ChatChannelAggregate>;

  constructor(eventStore: EventStore,
              eventBus: DomainEventBus,
              streamDecorator?: DomainEventStreamDecorator) {
    // Used competition instead of inheritance here, pick your thing.
    const factory = new SimpleEventSourcedAggregateFactory(ChatChannelAggregate);
    this.repository = new EventSourcingRepository(eventStore, eventBus, factory, streamDecorator);
    this.repository = new CachedEventSourcingRepositoryDecorator(this.repository);
  }

  public async has(id: UserId): Promise<boolean> {
    return this.repository.has(id);
  }

  public load(id: ChatChannelId): Promise<ChatChannelAggregate> {
    return this.repository.load(id);
  }

  public save(aggregate: ChatChannelAggregate): Promise<void> {
    return this.repository.save(aggregate);
  }
}
