import { SerializableAction } from '@triviality/eventsourcing-redux/Redux/SerializableAction';
import { ACCOUNT_STATE_RECEIVED } from '../Account/actions';
import { AppState } from './AppState';

export function appReducer(state: AppState = new AppState(), action: SerializableAction): AppState {
  switch (action.type) {

    case ACCOUNT_STATE_RECEIVED:
      return state.set('loggedIn', true);
  }

  return state;
}
