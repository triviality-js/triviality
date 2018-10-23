import { AnyAction, Store } from 'redux';
import { AppState } from './AppState';

export type AppStore = Store<AppState, AnyAction>;
