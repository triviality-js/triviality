import { SerializableAction } from 'eventsourcing-redux-bridge/Redux/SerializableAction';
import { AppState } from './AppState';

export function appReducer(state: AppState = new AppState(), _action: SerializableAction): AppState {


  return state;
}
