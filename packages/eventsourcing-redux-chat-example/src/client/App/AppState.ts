import { Record } from 'immutable';

export interface AppStateInterface {
  loggedIn: boolean;
}

export const defaultAppState: AppStateInterface = {
  loggedIn: false,
};

export class AppState extends Record<AppStateInterface>(defaultAppState, 'AppState') {
  constructor(values?: Partial<AppStateInterface>) {
    super(values);
  }
}
