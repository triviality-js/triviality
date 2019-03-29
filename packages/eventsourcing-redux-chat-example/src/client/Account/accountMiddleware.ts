import { asCommandAction } from '@triviality/eventsourcing-redux/CommandHandling/CommandAction';
import {
  GATEWAY_ERROR,
  GATEWAY_IS_OPEN,
  gatewayClose,
  gatewayOpen,
} from '@triviality/eventsourcing-redux/Gateway/actions';
import { hasEntityMetadata } from '@triviality/eventsourcing-redux/Redux/EntityMetadata';
import { AnyAction, Dispatch, Middleware, MiddlewareAPI } from 'redux';
import { UserLoginCommand } from '../../server/Command/UserLoginCommand';
import { UserRegisterCommand } from '../../server/Command/UserRegisterCommand';
import { UserId } from '../../shared/ValueObject/UserId';
import { StoreState } from '../StoreState';
import {
  ACCOUNT,
  queryAccountState,
  USER_LOGIN_SUCCEEDED,
  USER_REGISTRATION_SUCCEEDED,
  userLoggedOut,
} from './actions';

export const accountMiddleware: Middleware<{}, StoreState> = (api: MiddlewareAPI<Dispatch, StoreState>) => (next: Dispatch) => (action: AnyAction): any => {
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
