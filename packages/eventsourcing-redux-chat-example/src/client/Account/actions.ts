import { UserRegisterCommand } from '../../server/Command/UserRegisterCommand';
import { UserId } from '../../shared/ValueObject/UserId';
import {
  sendCommandAndListenToHandler,
  commandHandelingActionTypes,
} from 'eventsourcing-redux-bridge/CommandHandling/actions';
import {
  queryHandelingActionTypes,
  sendQuery,
} from 'eventsourcing-redux-bridge/QueryHandling/actions';
import { QueryAccountState } from '../../server/Query/QueryAccountState';
import { EntityName } from 'eventsourcing-redux-bridge/ValueObject/EntityName';
import { actionTypeWithEntity } from 'eventsourcing-redux-bridge/Redux/EntityMetadata';
import { UserLoginCommand } from '../../server/Command/UserLoginCommand';
import { UserLogoutCommand } from '../../server/Command/UserLogoutCommand';
import { INITIAL_PLAYHEAD } from 'eventsourcing-redux-bridge/ValueObject/Playhead';
import { WithPlayheadInterface } from 'eventsourcing-redux-bridge/ReadModel/PlayheadRecord';

export const ACCOUNT: EntityName = 'account';

// Application wide actions.
export const USER_LOGGED_IN = actionTypeWithEntity('user logged in', ACCOUNT);
export const USER_LOGGED_OUT = actionTypeWithEntity('user logged out', ACCOUNT);

// Commands
export const {
  commandSucceeded: USER_REGISTRATION_SUCCEEDED,
} = commandHandelingActionTypes(ACCOUNT, UserRegisterCommand);
export const {
  commandSucceeded: USER_LOGIN_SUCCEEDED,
} = commandHandelingActionTypes(ACCOUNT, UserLoginCommand);

// Queries
export const {
  querySucceeded: ACCOUNT_STATE_RECEIVED,
} = queryHandelingActionTypes(ACCOUNT, QueryAccountState);

export function registerAccount(name: string, password: string) {
  return sendCommandAndListenToHandler<void>(
    new UserRegisterCommand(UserId.create(), name, password),
    ACCOUNT,
  );
}

export function loginAccount(name: string, password: string) {
  return sendCommandAndListenToHandler<void>(
    new UserLoginCommand(name, password),
    ACCOUNT,
  );
}

export function logoutAccount() {
  return sendCommandAndListenToHandler<void>(
    new UserLogoutCommand(),
    ACCOUNT,
  );
}

export function queryAccountState(id: UserId, record: WithPlayheadInterface | null) {
  return sendQuery(
    new QueryAccountState(id, record ? record.playhead : INITIAL_PLAYHEAD),
    ACCOUNT,
  );
}

export function userLoggedIn(userId: UserId) {
  return {
    type: USER_LOGGED_IN,
    userId,
    metadata: {
      entity: ACCOUNT,
    },
  };
}

export function userLoggedOut() {
  return {
    type: USER_LOGGED_OUT,
    metadata: {
      entity: ACCOUNT,
    },
  };
}

export function openAccountGateway() {
  return {
    type: USER_LOGGED_OUT,
    metadata: {
      entity: ACCOUNT,
    },
  };
}
