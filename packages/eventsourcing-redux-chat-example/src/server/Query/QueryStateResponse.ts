import { ReadModelAction } from "eventsourcing-redux-bridge/ReadModel/ReadModelAction";

export interface QueryStateResponse<T> {

  actions?: ReadModelAction[];

  state?: T;

}
