import { Identity } from '@triviality/eventsourcing/ValueObject/Identity';
import { ReadModelAction, ReadModelMetadata } from './ReadModelAction';

/**
 * For passing events between the projector and redux store.
 *
 * 1. Dispatch the given action to the store.
 * 2. Save the new State to read model repository.
 * 3. Transmit the action by the gateway.
 */
export interface ProjectorGatewayInterface<
  Id extends Identity,
  Metadata extends ReadModelMetadata<Id> = ReadModelMetadata<Id>,
  Action extends ReadModelAction<Id, Metadata> = ReadModelAction<Id, Metadata>> {
  /**
   * For passing any action.
   */
  dispatchActionAndSave(
    id: Id,
    action: Action,
  ): Promise<void>;

}
