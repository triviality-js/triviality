import {
  commandHandelingActionTypes,
  sendCommandAndListenToHandler,
} from '@triviality/eventsourcing-redux/CommandHandling/actions';
import { queryHandelingActionTypes, sendQuery } from '@triviality/eventsourcing-redux/QueryHandling/actions';
import { WithPlayheadInterface } from '@triviality/eventsourcing-redux/ReadModel/PlayheadRecord';
import { actionTypeWithEntity } from '@triviality/eventsourcing-redux/Redux/EntityMetadata';
import { EntityName } from '@triviality/eventsourcing-redux/ValueObject/EntityName';
import { INITIAL_PLAYHEAD } from '@triviality/eventsourcing-redux/ValueObject/Playhead';
import { UserLoginCommand } from '../../server/Command/UserLoginCommand';
import { UserLogoutCommand } from '../../server/Command/UserLogoutCommand';
import { UserRegisterCommand } from '../../server/Command/UserRegisterCommand';
import { QueryAccountState } from '../../server/Query/QueryAccountState';
import { UserId } from '../../shared/ValueObject/UserId';

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
