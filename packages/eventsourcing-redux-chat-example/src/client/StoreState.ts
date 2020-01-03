import { AccountState } from './Account/AcountState';
import { AppState } from './App/AppState';
import { Action } from 'redux';
import { Metadata } from '@triviality/eventsourcing/Metadata';

export interface StoreState {
  app: AppState;
  account: AccountState;
}

export type StoreActions = Action & Metadata;

export type StoredState = Pick<StoreState, 'account'>;
