import { Nullable, RecordWithPlayhead } from '@triviality/eventsourcing-redux/ReadModel/PlayheadRecord';
import { SerializableAction } from '@triviality/eventsourcing-redux/Redux/SerializableAction';
import { QueryStateResponse } from '../../server/Query/QueryStateResponse';
import { UserId } from '../../shared/ValueObject/UserId';

export interface AccountStateInterface {
  id: UserId;
  name: string;
}

export const defaultAccountState: Nullable<AccountStateInterface> = {
  id: null,
  name: null,
};

export class AccountState extends RecordWithPlayhead<AccountStateInterface>(defaultAccountState, 'AccountState') {

  public registered(userId: UserId, name: string) {
    return this.set('id', userId).set('name', name);
  }

  public handleQueryStateResponse(response: QueryStateResponse<this>, reducer: (state: this, action: SerializableAction) => this): this {
    if (response.state) {
      return response.state;
    }
    if (response.actions) {
      return response.actions.reduce(
        (prevState, a) => {
          return reducer(prevState, a);
        },
        this,
      );
    }
    return this;
  }

}
