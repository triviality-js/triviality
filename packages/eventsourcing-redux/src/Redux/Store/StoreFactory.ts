import { AnyAction, DeepPartial, Store, StoreEnhancer } from 'redux';

export interface StoreFactory<S, A extends AnyAction = AnyAction> {

  create(enhancer?: StoreEnhancer): Store<S, A>;

  createFromState(state: DeepPartial<S>, enhancer?: StoreEnhancer): Store<S, A>;

}
