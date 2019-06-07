import { SerializableAction } from '../Redux/SerializableAction';
import { Identity, IdentityConstructor } from '@triviality/eventsourcing/ValueObject/Identity';
import { InvalidTypeError } from './Error/InvalidTypeError';
import { EntityMetadata } from '../Redux/EntityMetadata';
import { Playhead } from '../ValueObject/Playhead';

export interface ReadModelMetadata<ReadModelId extends Identity = Identity> extends EntityMetadata {
  readModelId: ReadModelId;
  recordedOn: Date;
  playhead?: Playhead;
}

export interface ReadModelAction<ReadModelId extends Identity = Identity,
  Metadata extends ReadModelMetadata<ReadModelId> = ReadModelMetadata<ReadModelId>>
  extends SerializableAction<Metadata> {
}

export function asReadModelAction<
  ReadModelId extends Identity = Identity,
  Metadata extends ReadModelMetadata<ReadModelId> = ReadModelMetadata<ReadModelId>>(
  action: SerializableAction,
  ReadModelIdClass?: IdentityConstructor<ReadModelId>,
): ReadModelAction<ReadModelId, Metadata> {
  if (!(action.metadata.recordedOn instanceof Date)) {
    throw InvalidTypeError.actionMissingRecordedOn();
  }
  if (ReadModelIdClass && !(action.metadata.readModelId instanceof ReadModelIdClass)) {
    throw InvalidTypeError.actionReadModelIdNotInstanceOf(action, ReadModelIdClass);
  }
  return action as any;
}
