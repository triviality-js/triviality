import { AnyAction, Dispatch, MiddlewareAPI } from 'redux';
import { hasEntityMetadata } from 'eventsourcing-redux-bridge/Redux/EntityMetadata';

export function appMiddleware<D extends Dispatch = Dispatch, S = any, Action extends AnyAction = AnyAction>() {
  return (_api: MiddlewareAPI<D, S>) => (next: D) => (action: Action): any => {
    const result = next(action);
    if (!hasEntityMetadata(action)) {
      return result;
    }

    switch (action.type) {

    }

    return result;
  };
}
