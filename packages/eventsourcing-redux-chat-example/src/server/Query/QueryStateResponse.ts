import { ReadModelAction } from '@triviality/eventsourcing-redux/ReadModel/ReadModelAction';

export class QueryStateResponse<T> {

  public static actionsResponse<T>(actions: ReadModelAction[]) {
    return new QueryStateResponse<T>(actions, null);
  }

  public static stateResponse<T>(state: T) {
    return new QueryStateResponse<T>([], state);
  }

  constructor(
    public readonly actions: ReadModelAction[] | null,
    public readonly state: T | null,
  ) {

  }

}
