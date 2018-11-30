import { UserRegisterCommand } from '../../server/Command/UserRegisterCommand';
import { UserId } from '../../shared/ValueObject/UserId';
import {
  sendCommandAndListenToHandler,
  commandHandelingActionTypes
} from 'eventsourcing-redux-bridge/CommandHandling/actions';
import {
  queryHandelingActionTypes,
  sendQuery
} from 'eventsourcing-redux-bridge/QueryHandling/actions';
import { QueryAccountState } from '../../server/Query/QueryAccountState';
import { EntityName } from 'eventsourcing-redux-bridge/ValueObject/EntityName';
import { actionTypeWithEntity } from "eventsourcing-redux-bridge/Redux/EntityMetadata";

export const ACCOUNT: EntityName = 'account';

// Application wide actions.
export const USER_LOGGED_IN = actionTypeWithEntity('user logged in', ACCOUNT);
export const USER_LOGGED_OUT = actionTypeWithEntity('user logged out', ACCOUNT);

// Commands
export const {
  commandSucceeded: USER_REGISTRATION_SUCCEEDED
} = commandHandelingActionTypes(ACCOUNT, UserRegisterCommand);

// Queries
export const {
  querySucceeded: ACCOUNT_STATE_RECEIVED
} = queryHandelingActionTypes(ACCOUNT, QueryAccountState);

export function registerAccount(name: string, password: string) {
  return sendCommandAndListenToHandler<void>(
    new UserRegisterCommand(UserId.create(), name, password),
    ACCOUNT
  );
}

export function queryAccountState(id: UserId) {
  return sendQuery(
    new QueryAccountState(id, 0),
    ACCOUNT
  );
}

export function userLoggedIn(userId: UserId) {
  return {
    type: USER_LOGGED_IN,
    userId,
    metadata: {
      entity: ACCOUNT,
    },
  }
}

export function userLoggedOut() {
  return {
    type: USER_LOGGED_OUT,
    metadata: {
      entity: ACCOUNT,
    },
  }
}

export function openAccountGateway() {
  return {
    type: USER_LOGGED_OUT,
    metadata: {
      entity: ACCOUNT,
    },
  }
}
