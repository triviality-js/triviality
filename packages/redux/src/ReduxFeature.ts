import { Feature, Optional } from '@triviality/core';
import {
  Action,
  applyMiddleware,
  combineReducers,
  createStore, Dispatch,
  Middleware,
  ReducersMapObject,
  Store,
  StoreEnhancer,
} from 'redux';
import { composeWithDevTools, EnhancerOptions } from 'redux-devtools-extension';
import { combineEpics, createEpicMiddleware, Epic, EpicMiddleware } from 'redux-observable';

export class ReduxFeature<S = {}, A extends Action<any> = Action<any>> implements Feature {

  public registries() {
    return {
      reducers: (): Optional<ReducersMapObject<S, A>> => {
        return {};
      },
      middleware: (): Array<Middleware<{}, S, Dispatch>> => {
        return [this.epicMiddleware()];
      },
      epics: (): Array<Epic<A, A, S>> => {
        return [];
      },
      enhancers: (): StoreEnhancer[] => {
        return [this.middlewareEnhancer()];
      },
    };
  }

  public setup() {
    // Create store first for epicMiddleware.
    this.store();
    this.epicMiddleware().run(this.rootEpic());
  }

  public devToolsOptions(): EnhancerOptions {
    return {};
  }

  public store(): Store<any> {
    const composeEnhancers = composeWithDevTools(this.devToolsOptions());
    const registries = this.registries();
    return createStore(
      combineReducers<S>(registries.reducers() as any),
      composeEnhancers(...registries.enhancers()),
    );
  }

  public middlewareEnhancer() {
    const registries = this.registries();
    return applyMiddleware(...registries.middleware());
  }

  public rootEpic() {
    return combineEpics(
      ...this.registries().epics(),
    );
  }

  public epicMiddleware(): EpicMiddleware<A, A, S, Dispatch<A>> {
    return createEpicMiddleware<A, A, S, Dispatch<A>>();
  }

}
