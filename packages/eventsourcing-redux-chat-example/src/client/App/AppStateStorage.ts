import { StateStorageInterface } from '@triviality/eventsourcing-redux/Redux/StateStorageInterface';
import { LoggerInterface } from '@triviality/logger';
import { SingleValueStoreAdapter } from '@triviality/storage';
import * as _ from 'lodash';
import { StoredState, StoreState } from '../StoreState';
import { AppState } from './AppState';

export class AppStateStorage implements StateStorageInterface<StoreState> {

  constructor(private store: SingleValueStoreAdapter<StoredState>, private logger: LoggerInterface) {

  }

  public set(value: StoreState): void {
    const picked = _.pick(value, ['account']);
    try {
      this.store.set(picked);
    } catch (e) {
      this.logger.error(e);
    }
  }

  public get(): StoreState | null {
    try {
      return {
        ...this.store.get(),
        app: new AppState(),
      };
    } catch (e) {
      return null;
    }
  }
}
