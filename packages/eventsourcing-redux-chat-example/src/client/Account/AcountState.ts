import { Nullable, projectionRecord } from '@triviality/eventsourcing-redux/ReadModel/projectionRecord';
import { UserId } from '../../shared/ValueObject/UserId';

export interface AccountStateInterface {
  id: UserId;
  name: string;
}

export const defaultAccountState: Nullable<AccountStateInterface> = {
  id: null,
  name: null,
};

export class AccountState extends projectionRecord<AccountStateInterface>(defaultAccountState, 'AccountState') {

  public registered(userId: UserId, name: string) {
    return this.set('id', userId).set('name', name);
  }

}
