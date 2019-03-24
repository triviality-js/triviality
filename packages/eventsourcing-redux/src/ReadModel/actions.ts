import { DomainMessage } from '@triviality/eventsourcing/Domain/DomainMessage';
import { DomainEvent } from '@triviality/eventsourcing/Domain/DomainEvent';
import { Identity } from '@triviality/eventsourcing/ValueObject/Identity';
import { DomainEventAction, domainEventActionType, DomainEventMetadata } from './DomainEventAction';
import { EntityName } from '../ValueObject/EntityName';

/**
 * Create an action from a domain message.
 */
export function actionForDomainMessage<ReadModelId extends Identity = Identity, AggregateId extends Identity = Identity>(
  id: ReadModelId,
  message: DomainMessage<DomainEvent, AggregateId>,
  entity: EntityName,
  additionalMetadata: { entity?: string, [extraProps: string]: any } = {},
): DomainEventAction<DomainEvent, ReadModelId, AggregateId, DomainEventMetadata<ReadModelId, AggregateId> & typeof additionalMetadata> {
  return {
    type: domainEventActionType(message.payload, entity),
    event: message.payload,
    metadata: {
      entity,
      recordedOn: message.recordedOn,
      readModelId: id,
      aggregateId: message.aggregateId,
      ...additionalMetadata,
    },
  };
}
