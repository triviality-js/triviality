import { AnyAction, Dispatch, MiddlewareAPI } from 'redux';
import { hasEntityMetadata } from 'eventsourcing-redux-bridge/Redux/EntityMetadata';
import {
  ACCOUNT,
  queryAccountState,
  USER_REGISTRATION_SUCCEEDED,
  userLoggedOut,
  USER_LOGIN_SUCCEEDED,
} from './actions';
import { GATEWAY_ERROR, GATEWAY_IS_OPEN, gatewayClose, gatewayOpen } from 'eventsourcing-redux-bridge/Gateway/actions';
import { asCommandAction } from 'eventsourcing-redux-bridge/CommandHandling/CommandAction';
import { UserRegisterCommand } from '../../server/Command/UserRegisterCommand';
import { UserLoginCommand } from '../../server/Command/UserLoginCommand';
import { UserId } from '../../shared/ValueObject/UserId';
import { StoreState } from '../StoreState';

export function accountMiddleware<D extends Dispatch = Dispatch, Action extends AnyAction = AnyAction>() {
  return (api: MiddlewareAPI<D, StoreState>) => (next: D) => (action: Action): any => {
    const result = next(action);
    if (!hasEntityMetadata(action)) {
      return result;
    }

    switch (action.type) {
      case USER_REGISTRATION_SUCCEEDED: {
        const domainAction = asCommandAction(action, UserRegisterCommand);
        const userId = domainAction.command.userId;
        api.dispatch(gatewayOpen(action.metadata.entity, `/account/${userId.toString()}`, {
          userId,
        }));
        break;
      }

      case USER_LOGIN_SUCCEEDED: {
        const domainAction = asCommandAction(action, UserLoginCommand);
        // TODO: remove any
        const userId: UserId = (domainAction as any).response;
        api.dispatch(gatewayOpen(action.metadata.entity, `/account/${userId.toString()}`, {
          userId,
        }));
        break;
      }

      case GATEWAY_ERROR(ACCOUNT):
        api.dispatch(gatewayClose(ACCOUNT, action.gate));
        api.dispatch(userLoggedOut());
        break;

      case GATEWAY_IS_OPEN(ACCOUNT):
        const state = api.getState();
        api.dispatch(queryAccountState(action.metadata.userId, state.account));
        break;

    }

    return result;
  };
}
