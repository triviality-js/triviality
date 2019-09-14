import { FeatureFactoryInjectContext } from './FeatureFactoryInjectContext';
import { FeatureFactoryRegistryContext } from './FeatureFactoryRegistryContext';
import { SF, ServiceFactoryType as SFT } from '../ServiceFactory';

export interface Index<T> extends FeatureFactoryRegistryContext<T>, FeatureFactoryInjectContext<T> {

  self(): T;

  service<K extends keyof T>(serviceTag: K): T[K];

  services<K1 extends keyof T>(t1: K1): [T[K1]];

  services<K1 extends keyof T, K2 extends keyof T>(t1: K1, t2: K2): [T[K1], T[K2]];

  services<K1 extends keyof T, K2 extends keyof T, K3 extends keyof T>(t1: K1, t2: K2, t3: K3): [T[K1], T[K2], T[K3]];

  services<K1 extends keyof T, K2 extends keyof T, K3 extends keyof T, K4 extends keyof T>(t1: K1, t2: K2, t3: K3, t4: K4): [T[K1], T[K2], T[K3], T[K4]];

  services<K1 extends keyof T, K2 extends keyof T, K3 extends keyof T, K4 extends keyof T, K5 extends keyof T>(t1: K1, t2: K2, t3: K3, t4: K4, t5: K5): [T[K1], T[K2], T[K3], T[K4], T[K5]];

  override<S extends SF>(factory: (parent: S) => S): SF<S>;

  overrideWith<K extends keyof T>(serviceTag: K): SF<T[K]>;

  construct<F extends new () => S, S>(F: F): () => S;

  construct<t1 extends keyof T, F extends new (d1: SFT<T[t1]>) => S, S>(t1: t1, F: F): () => S;

  construct<t1 extends keyof T, t2 extends keyof T, F extends new (d1: SFT<T[t1]>, d2: SFT<T[t2]>) => S, S>(k1: t1, t2: t2, F: F): () => S;

  construct<t1 extends keyof T, t2 extends keyof T, t3 extends keyof T, F extends new (d1: SFT<T[t1]>, d2: SFT<T[t2]>, d3: SFT<T[t3]>) => S, S>(k1: t1, t2: t2, t3: t3, F: F): () => S;

  construct<t1 extends keyof T, t2 extends keyof T, t3 extends keyof T, t4 extends keyof T, F extends new (d1: SFT<T[t1]>, d2: SFT<T[t2]>, d3: SFT<T[t3]>, d4: SFT<T[t4]>) => S, S>(k1: t1, t2: t2, t3: t3, t4: t4, F: F): () => S;

  construct<t1 extends keyof T, t2 extends keyof T, t3 extends keyof T, t4 extends keyof T, t5 extends keyof T, F extends new (d1: SFT<T[t1]>, d2: SFT<T[t2]>, d3: SFT<T[t3]>, d4: SFT<T[t4]>, d5: SFT<T[t5]>) => S, S>(k1: t1, t2: t2, t3: t3, t4: t4, t5: t5, F: F): () => S;

  construct<t1 extends keyof T, t2 extends keyof T, t3 extends keyof T, t4 extends keyof T, t5 extends keyof T, t6 extends keyof T, F extends new (d1: SFT<T[t1]>, d2: SFT<T[t2]>, d3: SFT<T[t3]>, d4: SFT<T[t4]>, d5: SFT<T[t5]>, d6: SFT<T[t6]>) => S, S>(k1: t1, t2: t2, t3: t3, t4: t4, t5: t5, t6: t6, F: F): () => S;
}
