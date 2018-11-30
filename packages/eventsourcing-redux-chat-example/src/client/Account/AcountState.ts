import { UserId } from '../../shared/ValueObject/UserId';
import { Nullable, RecordWithPlayhead } from "eventsourcing-redux-bridge/ReadModel/PlayheadRecord";

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
}
