import triviality, { Feature, OptionalRegistries } from '@triviality/core';
import {
  Action,
  AnyAction,
  Dispatch,
  Middleware, MiddlewareAPI,
  ReducersMapObject,
} from 'redux';
import { ReduxFeature } from '../ReduxFeature';
import { ActionsObservable, StateObservable } from 'redux-observable';
import { filter, mapTo, tap } from 'rxjs/operators';

it('Can add reducers, middleware and epics from other features', async (done) => {
  const spyMiddleware = jest.fn();

  const TestMiddleware: Middleware<{}> = (_store: MiddlewareAPI<any>) => (next: Dispatch<AnyAction>) => (action: AnyAction) => {
    spyMiddleware(action.type);
    return next(action);
  };

  function preferenceEpic(action$: ActionsObservable<Action>, _store: StateObservable<{ test: string }>) {
    return action$.pipe(
      filter((action: Action) => action.type === 'leaving'),
      mapTo({ type: 'bye!!' }),
      tap(() => done()),
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

  class MyFeature implements Feature {

    public registries(): OptionalRegistries<ReduxFeature<{ test: string }>> {
      return {
        reducers: (): ReducersMapObject<{ test: string }, Action<any>> => {
          return { test: testReducer };
        },
        middleware: (): Middleware[] => {
          return [TestMiddleware];
        },
        epics: () => {
          return [
            preferenceEpic,
          ];
        },
      };
    }
  }

  class MyReduxFeature extends ReduxFeature<{ test: string }> {

  }

  const container = await triviality()
    .add(MyReduxFeature)
    .add(MyFeature)
    .build();

  const store = container.store();
  expect(store.getState()).toEqual({ test: 'hi' });
  container.store().dispatch({ type: 'leaving' });
  expect(store.getState()).toEqual({ test: 'bye' });
  expect(spyMiddleware).toBeCalledWith('leaving');
});
