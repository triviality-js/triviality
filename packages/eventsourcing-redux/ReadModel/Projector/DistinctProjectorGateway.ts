import { Identity } from '@triviality/eventsourcing/ValueObject/Identity';
import { ReadModelAction, ReadModelMetadata } from '../ReadModelAction';
import { SimpleProjectorGateway } from './SimpleProjectorGateway';

/**
 * Only dispatched actions when store has a state change.
 */
export class DistinctProjectorGateway<
  State,
  Id extends Identity,
  Metadata extends ReadModelMetadata<Id> = ReadModelMetadata<Id>,
  Action extends ReadModelAction<Id, Metadata> = ReadModelAction<Id, Metadata>>
  extends SimpleProjectorGateway<State, Id, Metadata, Action> {

  public async dispatchActionAndSave(
    id: Id,
    action: Action,
  ) {
    const model = await this.repository.find(id);
    if (model) {
      const store = model.getStore();
      const state = store.getState();
      store.dispatch(action);
      if (state !== store.getState()) {
        await this.gateway.emit(action);
        await this.repository.save(model);
      }
    } else {
      return super.dispatchActionAndSave(id, action);
    }
  }

}
