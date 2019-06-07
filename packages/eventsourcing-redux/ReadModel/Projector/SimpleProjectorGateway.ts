import { StoreRepositoryInterface } from '../StoreRepositoryInterface';
import { Identity } from '@triviality/eventsourcing/ValueObject/Identity';
import { ServerGatewayInterface } from '../../Gateway/ServerGatewayInterface';
import { ProjectorGatewayInterface } from '../ProjectorGatewayInterface';
import { ReadModelAction, ReadModelMetadata } from '../ReadModelAction';

export class SimpleProjectorGateway<
  State,
  Id extends Identity = Identity,
  Metadata extends ReadModelMetadata<Id> = ReadModelMetadata<Id>,
  Action extends ReadModelAction<Id, Metadata> = ReadModelAction<Id, Metadata>> implements ProjectorGatewayInterface<Id, Metadata, Action> {

  constructor(protected readonly repository: StoreRepositoryInterface<State, Id, Metadata, Action>,
              protected readonly gateway: ServerGatewayInterface) {
  }

  public async dispatchActionAndSave(
    id: Id,
    action: Action,
  ) {
    let model = await this.repository.find(id);
    if (!model) {
      model = await this.repository.create(id);
    }
    model.getStore().dispatch(action);
    await this.repository.save(model);
    await this.gateway.emit(action);
  }

}
