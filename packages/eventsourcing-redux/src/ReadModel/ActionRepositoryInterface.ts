import { StoreRepositoryInterface } from './StoreRepositoryInterface';
import { Identity } from '@triviality/eventsourcing/ValueObject/Identity';
import { ReadModelAction, ReadModelMetadata } from './ReadModelAction';
import { ActionStream } from './ActionStream';

export interface ActionRepositoryInterface<State,
  Id extends Identity = Identity,
  Metadata extends ReadModelMetadata<Id> = ReadModelMetadata<Id>,
  Action extends ReadModelAction<Id, Metadata> = ReadModelAction<Id, Metadata>> extends StoreRepositoryInterface<State, Id, Metadata, Action> {

  load(id: Id): ActionStream<Action>;

  loadFromPlayhead(id: Id, playhead: number): ActionStream<Action>;

  append(id: Id, eventStream: ActionStream<Action>): Promise<void>;

}
