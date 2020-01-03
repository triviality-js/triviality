import triviality, { FF } from '@triviality/core';
import { Action, AnyAction, Dispatch, Middleware, MiddlewareAPI } from 'redux';
import { ActionsObservable, StateObservable } from 'redux-observable';
import { filter, mapTo } from 'rxjs/operators';
import { ReduxFeature, ReduxFeatureServices } from '../ReduxFeature';

it('Can add reducers, middleware and epics from other features', async () => {
  const spyMiddleware = jest.fn();

  const TestMiddleware: Middleware<{}> = (_store: MiddlewareAPI<any>) => (next: Dispatch<AnyAction>) => (action: AnyAction) => {
    spyMiddleware(action.type);
    return next(action);
  };

  function preferenceEpic(action$: ActionsObservable<Action>, _store: StateObservable<string>) {

    return action$.pipe(
      filter((action) => action.type === 'leaving'),
      mapTo({ type: 'bye!!' }),
    );
  }

  function testReducer(
    state: string = 'hi',
    action: Action<any>,
  ): string {

    switch (action.type) {
      case 'leaving':
        return 'bye';
    }

    return state;
  }

  const MyFeature: FF<{}, ReduxFeatureServices<string>> =
    ({
       registers: {
         middleware: m,
         reducers,
         epics: e,
       },
     }) =>
      ({
        ...m(() => TestMiddleware),
        ...reducers(['test', () => testReducer]),
        ...e(() => preferenceEpic),
      });

  const { store, middleware, epics } = await triviality()
    .add(ReduxFeature())
    .add(MyFeature)
    .build();

  expect(epics.toArray().length).toEqual(1);
  expect(middleware.toArray().length).toEqual(2);

  expect(store.getState()).toEqual({ test: 'hi' });
  store.dispatch({ type: 'leaving' });
  expect(store.getState()).toEqual({ test: 'bye' });
  expect(spyMiddleware).toBeCalledWith('leaving');
  expect(spyMiddleware).toBeCalledWith('bye!!');
});
