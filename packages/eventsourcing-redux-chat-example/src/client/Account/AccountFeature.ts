import { FF } from '@triviality/core';
import { Middleware } from 'redux';
import { ChatReduxFeatureServices } from '../ChatReduxFeature';
import { StoreState } from '../StoreState';
import { accountMiddleware } from './accountMiddleware';
import { accountReducer } from './accountReducer';

export interface AccountFeatureServices {
  accountMiddleware: Middleware<{}, StoreState>;
}

export const AccountFeature: FF<AccountFeatureServices, ChatReduxFeatureServices> =
  ({
     registers: {
       reducers,
       middleware,
     },
   }) => {

    reducers({
      account: () => accountReducer,
    });

    middleware('accountMiddleware');

    return {
      accountMiddleware(): Middleware<{}, StoreState> {
        return accountMiddleware;
      },
    };
  };
