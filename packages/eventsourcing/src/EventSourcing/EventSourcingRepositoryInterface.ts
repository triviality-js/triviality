import { EventSourcedAggregateRoot } from './EventSourcedAggregateRoot';
import { Identity } from '../ValueObject/Identity';
import { DomainEventStreamDecorator } from '../Domain/DomainEventStreamDecorator';

export interface EventSourcingRepositoryInterface<T extends EventSourcedAggregateRoot<Id> = EventSourcedAggregateRoot<any>, Id extends Identity = Identity> {

  has(id: Id): Promise<boolean>;

  load(id: Id): Promise<T>;

  save(aggregate: T, decorator?: DomainEventStreamDecorator): Promise<void>;

}
