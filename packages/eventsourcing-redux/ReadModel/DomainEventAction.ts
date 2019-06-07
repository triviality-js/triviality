import { SerializableAction } from '../Redux/SerializableAction';
import { DomainEvent, DomainEventConstructor } from '@triviality/eventsourcing/Domain/DomainEvent';
import { Identity, IdentityConstructor } from '@triviality/eventsourcing/ValueObject/Identity';
import { EntityName } from '../ValueObject/EntityName';
import { ClassUtil } from '@triviality/eventsourcing/ClassUtil';
import { actionTypeWithEntity } from '../Redux/EntityMetadata';
import { InvalidTypeError } from './Error/InvalidTypeError';
import { asReadModelAction, ReadModelAction, ReadModelMetadata } from './ReadModelAction';

export interface DomainEventMetadata<ReadModelId extends Identity = Identity, AggregateId extends Identity = Identity> extends ReadModelMetadata<ReadModelId> {
  aggregateId: AggregateId;
}

export interface DomainEventAction<Event extends DomainEvent,
  ReadModelId extends Identity = Identity,
  AggregateId extends Identity = Identity,
  Metadata extends DomainEventMetadata<ReadModelId, AggregateId> = DomainEventMetadata<ReadModelId, AggregateId>>
  extends ReadModelAction<ReadModelId, Metadata> {
  event: Event;
}

export function asDomainEventAction<Event extends DomainEvent,
  ReadModelId extends Identity = Identity,
  AggregateId extends Identity = Identity,
  Metadata extends DomainEventMetadata<ReadModelId, AggregateId> = DomainEventMetadata<ReadModelId, AggregateId>>(
  action: SerializableAction,
  eventClass: DomainEventConstructor<Event>,
  ReadModelIdClass: IdentityConstructor<ReadModelId>,
  AggregateIdClass: IdentityConstructor<AggregateId>,
): DomainEventAction<Event, ReadModelId, AggregateId, Metadata> {
  asReadModelAction(action, ReadModelIdClass);
  if (!(action.event instanceof eventClass)) {
    throw InvalidTypeError.actionEventDoesNotMatchEventClass(action, eventClass);
  }
  if (!(action.metadata.aggregateId instanceof AggregateIdClass)) {
    throw InvalidTypeError.actionAggregateIdNotInstanceOf(action, AggregateIdClass);
  }
  return action as any;
}

export function domainEventActionType(domainEvent: DomainEventConstructor<any> | DomainEvent, entity: EntityName) {
  return actionTypeWithEntity(ClassUtil.nameOff(domainEvent), entity);
}
