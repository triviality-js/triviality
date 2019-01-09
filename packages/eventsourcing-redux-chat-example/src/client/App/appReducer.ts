import { SerializableAction } from 'eventsourcing-redux-bridge/Redux/SerializableAction';
import { AppState } from './AppState';
import { ACCOUNT_STATE_RECEIVED } from '../Account/actions';

export function appReducer(state: AppState = new AppState(), action: SerializableAction): AppState {
  switch (action.type) {

    case ACCOUNT_STATE_RECEIVED:
      return state.set('loggedIn', true);

  }

  return state;
}
