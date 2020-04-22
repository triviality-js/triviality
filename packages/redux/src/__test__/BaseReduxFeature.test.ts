import triviality, { FF } from '@triviality/core';
import { Action, AnyAction, Dispatch, Middleware, MiddlewareAPI } from 'redux';
import { BaseReduxFeature, BaseReduxFeatureServices } from '../BaseReduxFeature';

it('Can add middleware', async () => {
  const TestMiddleware: Middleware<{}> = (api: MiddlewareAPI<any>) => (next: Dispatch<AnyAction>) => (action: AnyAction) => {
    next(action);
    if (action.type === 'leaving') {
      api.dispatch({
        type: 'bye',
      });
    }
  };

  function testReducer(
    state: string = 'hi',
    action: Action<any>,
  ): string {

    switch (action.type) {
      case 'leaving':
        return 'bye';
      case 'bye':
        return 'bye-bye';
    }

    return state;
  }

  const MyFeature: FF<{}, BaseReduxFeatureServices<string>> =
    ({
       registers: {
         middleware,
         reducers,
       },
     }) =>
      ({
        ...middleware(() => TestMiddleware),
        ...reducers(['test', () => testReducer]),
      });

  const { store, middleware: m } = await triviality()
    .add(BaseReduxFeature<string, AnyAction>())
    .add(MyFeature)
    .build();

  expect(m.toArray().length).toEqual(1);

  expect(store.getState()).toEqual({ test: 'hi' });
  store.dispatch({ type: 'leaving' });
  expect(store.getState()).toEqual({ test: 'bye-bye' });
});
