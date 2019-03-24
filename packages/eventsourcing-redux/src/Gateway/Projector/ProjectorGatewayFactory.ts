import { Identity } from '@triviality/eventsourcing/ValueObject/Identity';
import { ProjectorGatewayInterface } from '../../ReadModel/ProjectorGatewayInterface';
import { ReadModelAction, ReadModelMetadata } from '../../ReadModel/ReadModelAction';

export interface ProjectorGatewayFactory<
  T,
  Id extends Identity = Identity,
  Metadata extends ReadModelMetadata<Id> = ReadModelMetadata<Id>,
  Action extends ReadModelAction<Id, Metadata> = ReadModelAction<Id, Metadata>> {

  open(options: T): ProjectorGatewayInterface<Id, Metadata, Action>;

  get(options: T): ProjectorGatewayInterface<Id, Metadata, Action>;

  close(options: T): void;
}
