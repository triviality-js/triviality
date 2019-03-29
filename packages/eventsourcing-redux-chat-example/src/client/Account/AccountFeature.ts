import { Feature, OptionalRegistries } from '@triviality/core';
import { Middleware } from 'redux';
import { ChatReduxFeature } from '../ChatReduxFeature';
import { StoreState } from '../StoreState';
import { accountMiddleware } from './accountMiddleware';
import { accountReducer } from './accountReducer';

export class AccountFeature implements Feature {

  public registries(): OptionalRegistries<ChatReduxFeature> {
    return {
      reducers: () => {
        return {
          account: accountReducer,
        };
      },
      middleware: () => {
        return [this.accountMiddleware()];
      },
    };
  }

  public accountMiddleware(): Middleware<{}, StoreState> {
    return accountMiddleware;
  }
}
