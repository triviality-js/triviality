import { ReadModelAction } from '@triviality/eventsourcing-redux/ReadModel/ReadModelAction';
import { SerializableAction } from '../Redux/SerializableAction';

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

  public apply(state: T, reducer: (state: T, action: SerializableAction) => T): T {
    if (this.state) {
      return this.state;
    }
    if (this.actions) {
      return this.actions.reduce(
        (prevState, a) => {
          return reducer(prevState, a);
        },
        state,
      );
    }
    return state;
  }

}
