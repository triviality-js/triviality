import { FF, RegistryMap, RegistrySet, SetupFeatureServices } from '@triviality/core';
import { Action, AnyAction } from 'redux';
import { combineEpics, createEpicMiddleware, Epic, EpicMiddleware } from 'redux-observable';
import { BaseReduxFeatureServices } from './BaseReduxFeature';

export interface ReduxEpicFeatureServices<S = any, A extends Action = AnyAction, D = {}> {
  epics: RegistrySet<Epic<A, A, S, D>>;
  epicDependenciesRegistry: RegistryMap<unknown, keyof D>;
  epicDependencies: D;
  rootEpic: Epic<A, A, S, D>;
  epicMiddleware: EpicMiddleware<A, A, S, D>;
}

export const ReduxEpicFeature: <S = any, A extends Action = AnyAction, D = {}>() =>
  FF<ReduxEpicFeatureServices<S, A, D>, BaseReduxFeatureServices<S, A> & SetupFeatureServices> = () =>
  ({ registerMap, instances, registerSet, registers: { setupCallbacks, middleware } }) => ({
    ...middleware('epicMiddleware'),
    epics: registerSet(),
    epicDependenciesRegistry: registerMap(),
    ...setupCallbacks(() => () => {
      const { epicMiddleware, rootEpic } = instances('epicMiddleware', 'rootEpic');
      epicMiddleware.run(rootEpic);
    }),
    epicDependencies() {
      return this.epicDependenciesRegistry().toObject() as any;
    },
    epicMiddleware() {
      return createEpicMiddleware({ dependencies: this.epicDependencies() });
    },
    rootEpic(): Epic {
      return combineEpics(
        ...this.epics(),
      );
    },
  });
