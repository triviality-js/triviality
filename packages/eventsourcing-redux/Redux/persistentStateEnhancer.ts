import { StoreEnhancer, StoreEnhancerStoreCreator } from 'redux';
import { StateStorageInterface } from './StateStorageInterface';

export function persistentStateEnhancer<S>(storage: StateStorageInterface<S>): StoreEnhancer<{}, {}> {
  return (next: StoreEnhancerStoreCreator) => {
    return (reducer, preloadedState?: any) => {
      const storedState = storage.get(preloadedState as any);
      const store = next(reducer, storedState || preloadedState);
      store.subscribe(() => {
        storage.set(store.getState() as any);
      });
      return store;
    };
  };
}
