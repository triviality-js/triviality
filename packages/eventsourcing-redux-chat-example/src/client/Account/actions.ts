import { UserRegisterCommand } from '../../server/Command/UserRegisterCommand';
import { UserId } from '../../shared/ValueObject/UserId';
import { typeWithEntity } from 'eventsourcing-redux-bridge/Redux/EntityMetadata';
import { sendCommandAndListenToHandler } from 'eventsourcing-redux-bridge/CommandHandling/actions';

export const ACCOUNT_ENTITY_NAME = 'account';

export const USER_LOGGED_IN = typeWithEntity('user logged in', ACCOUNT_ENTITY_NAME);
export const USER_LOGGED_OUT = typeWithEntity('user logged out', ACCOUNT_ENTITY_NAME);

export function registerAccount(name: string, password: string) {
  return sendCommandAndListenToHandler<void>(
    new UserRegisterCommand(UserId.create(), name, password),
    'register'
  );
}

export function userLoggedIn(userId: UserId) {
  return {
    type: USER_LOGGED_IN,
    userId,
    metadata: {
      entity: ACCOUNT_ENTITY_NAME,
    },
  }
}

export function userLoggedOut() {
  return {
    type: USER_LOGGED_OUT,
    metadata: {
      entity: ACCOUNT_ENTITY_NAME,
    },
  }
}
