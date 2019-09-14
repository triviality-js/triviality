import { FeatureFactory } from '../FeatureFactory';
import { ServiceFactoryType as SFT } from '../ServiceFactory';

export interface FeatureFactoryInjectContext<T> {
  inject<t1 extends keyof T, F extends (d1: SFT<T[t1]>) => S, S>(t1: t1, F: F): () => S;

  inject<t1 extends keyof T, t2 extends keyof T, F extends (d1: SFT<T[t1]>, d2: SFT<T[t2]>) => S, S>(k1: t1, t2: t2, F: F): () => S;

  inject<t1 extends keyof T, t2 extends keyof T, t3 extends keyof T, F extends (d1: SFT<T[t1]>, d2: SFT<T[t2]>, d3: SFT<T[t3]>) => S, S>(k1: t1, t2: t2, t3: t3, F: F): () => S;

  inject<t1 extends keyof T, t2 extends keyof T, t3 extends keyof T, t4 extends keyof T, F extends (d1: SFT<T[t1]>, d2: SFT<T[t2]>, d3: SFT<T[t3]>, d4: SFT<T[t4]>) => S, S>(k1: t1, t2: t2, t3: t3, t4: t4, F: F): () => S;

  inject<t1 extends keyof T, t2 extends keyof T, t3 extends keyof T, t4 extends keyof T, t5 extends keyof T, F extends (d1: SFT<T[t1]>, d2: SFT<T[t2]>, d3: SFT<T[t3]>, d4: SFT<T[t4]>, d5: SFT<T[t5]>) => S, S>(k1: t1, t2: t2, t3: t3, t4: t4, t5: t5, F: F): () => S;

  inject<t1 extends keyof T, t2 extends keyof T, t3 extends keyof T, t4 extends keyof T, t5 extends keyof T, t6 extends keyof T, F extends (d1: SFT<T[t1]>, d2: SFT<T[t2]>, d3: SFT<T[t3]>, d4: SFT<T[t4]>, d5: SFT<T[t5]>, d6: SFT<T[t6]>) => S, S>(k1: t1, t2: t2, t3: t3, t4: t4, t5: t5, t6: t6, F: F): () => S;
}

export function injectServices<Tags extends string[], Services>(fetchServices: { [key: string]: FeatureFactory<Services> }, ...args: Tags) {
  const tags: string[] = args.slice(0, -1);
  const service: (...args: any[]) => unknown = args.slice(-1)[0];
  return service(...tags.map((tag) => container[tag]()));
}
