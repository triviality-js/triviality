import { AnyAction, createStore, DeepPartial, Reducer, Store, StoreEnhancer } from 'redux';
import { StoreFactory } from './StoreFactory';

export class SimpleStoreFactory<S, A extends AnyAction> implements StoreFactory<S, A> {

  constructor(
    private readonly reducers: Reducer<S, A>) {
  }

  public create(enhancer?: StoreEnhancer): Store<S, A> {
    return createStore(this.reducers, enhancer);
  }

  public createFromState(state: DeepPartial<S>, enhancer?: StoreEnhancer): Store<S, A> {
    return createStore(this.reducers, state as any, enhancer as any);
  }

}
