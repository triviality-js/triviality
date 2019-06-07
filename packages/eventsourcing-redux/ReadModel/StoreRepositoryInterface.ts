import { StoreReadModel } from './Model/StoreReadModel';
import { Repository } from '@triviality/eventsourcing/ReadModel/Repository';
import { Identity } from '@triviality/eventsourcing/ValueObject/Identity';
import { ReadModelAction, ReadModelMetadata } from './ReadModelAction';

export interface StoreRepositoryInterface<
  State,
  Id extends Identity = Identity,
  Metadata extends ReadModelMetadata<Id> = ReadModelMetadata<Id>,
  Action extends ReadModelAction<Id, Metadata> = ReadModelAction<Id, Metadata>> extends Repository<StoreReadModel<State, Id, Metadata, Action>> {

  create(id: Id): Promise<StoreReadModel<State, Id, Metadata, Action>>;

}
