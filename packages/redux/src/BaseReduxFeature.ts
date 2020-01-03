import { FF, RegistryList, RegistryMap } from '@triviality/core';
import {
  Action, AnyAction,
  applyMiddleware,
  combineReducers,
  compose,
  createStore,
  Middleware,
  Reducer,
  Store,
  StoreEnhancer,
} from 'redux';

/**
 * Basic redux functionality services.
 */
export interface BaseReduxFeatureServices<S = any, A extends Action = AnyAction> {
  reducers: RegistryMap<Reducer<any, any>, string>;
  middleware: RegistryList<Middleware<{}, S>>;
  enhancers: RegistryList<StoreEnhancer>;

  store: Store<S, A>;
  rootReducer: Reducer<S, A>;
  rootEnhancer: StoreEnhancer;
  middlewareEnhancer: StoreEnhancer;

  preloadedState: S | undefined;
}

export const BaseReduxFeature: <S = any, A extends Action = AnyAction>() => FF<BaseReduxFeatureServices<S, A>> = <S, A extends Action>() => ({ registerMap, registerList }) => ({
  reducers: registerMap(),
  middleware: registerList(),
  enhancers: registerList('middlewareEnhancer'),
  store(): Store<S, A> {
    const state = this.preloadedState();
    if (state === undefined) {
      return createStore<S, A, {}, {}>(
        this.rootReducer() as any,
        this.rootEnhancer(),
      );
    }
    return createStore<S, A, {}, {}>(
      this.rootReducer() as any,
      state,
      this.rootEnhancer(),
    );
  },
  rootEnhancer() {
    return compose(...this.enhancers());
  },
  rootReducer(): Reducer<S, A> {
    const reducers = this.reducers().toObject();
    return combineReducers(reducers as any) as any;
  },
  middlewareEnhancer() {
    return applyMiddleware(...this.middleware());
  },
  preloadedState: () => undefined,
}) as any;
