import { curryN, construct } from 'ramda';
import { ServiceFactory, ServiceFactoryType as SFT, ServiceTag, SF } from '../ServiceFactory';
import { servicesByTags } from './FeatureFactoryServicesContext';

/**
 * Context for constructing new services.
 */
export interface FeatureFactoryConstructContext<T> {
  /**
   * @typeGenerator({
   *  empty: true,
   *  templates: [
   *    "  construct<{{T% extends keyof T}}, F extends new ({{d%: SFT<T[T%]>}}) => S, S>({{t%: T%}}, F: F): SF<S>;\n"
   *   ],
   * })
   */
  construct<F extends new () => S, S>(F: F): SF<S>;

  construct<T1 extends keyof T, F extends new (d1: SFT<T[T1]>) => S, S>(t1: T1, F: F): SF<S>;

  construct<T1 extends keyof T, T2 extends keyof T, F extends new (d1: SFT<T[T1]>, d2: SFT<T[T2]>) => S, S>(t1: T1, t2: T2, F: F): SF<S>;

  construct<T1 extends keyof T, T2 extends keyof T, T3 extends keyof T, F extends new (d1: SFT<T[T1]>, d2: SFT<T[T2]>, d3: SFT<T[T3]>) => S, S>(t1: T1, t2: T2, t3: T3, F: F): SF<S>;

  construct<T1 extends keyof T, T2 extends keyof T, T3 extends keyof T, T4 extends keyof T, F extends new (d1: SFT<T[T1]>, d2: SFT<T[T2]>, d3: SFT<T[T3]>, d4: SFT<T[T4]>) => S, S>(t1: T1, t2: T2, t3: T3, t4: T4, F: F): SF<S>;

  construct<T1 extends keyof T, T2 extends keyof T, T3 extends keyof T, T4 extends keyof T, T5 extends keyof T, F extends new (d1: SFT<T[T1]>, d2: SFT<T[T2]>, d3: SFT<T[T3]>, d4: SFT<T[T4]>, d5: SFT<T[T5]>) => S, S>(t1: T1, t2: T2, t3: T3, t4: T4, t5: T5, F: F): SF<S>;

  construct<T1 extends keyof T, T2 extends keyof T, T3 extends keyof T, T4 extends keyof T, T5 extends keyof T, T6 extends keyof T, F extends new (d1: SFT<T[T1]>, d2: SFT<T[T2]>, d3: SFT<T[T3]>, d4: SFT<T[T4]>, d5: SFT<T[T5]>, d6: SFT<T[T6]>) => S, S>(t1: T1, t2: T2, t3: T3, t4: T4, t5: T5, t6: T6, F: F): SF<S>;

  construct<T1 extends keyof T, T2 extends keyof T, T3 extends keyof T, T4 extends keyof T, T5 extends keyof T, T6 extends keyof T, T7 extends keyof T, F extends new (d1: SFT<T[T1]>, d2: SFT<T[T2]>, d3: SFT<T[T3]>, d4: SFT<T[T4]>, d5: SFT<T[T5]>, d6: SFT<T[T6]>, d7: SFT<T[T7]>) => S, S>(t1: T1, t2: T2, t3: T3, t4: T4, t5: T5, t6: T6, t7: T7, F: F): SF<S>;

  construct<T1 extends keyof T, T2 extends keyof T, T3 extends keyof T, T4 extends keyof T, T5 extends keyof T, T6 extends keyof T, T7 extends keyof T, T8 extends keyof T, F extends new (d1: SFT<T[T1]>, d2: SFT<T[T2]>, d3: SFT<T[T3]>, d4: SFT<T[T4]>, d5: SFT<T[T5]>, d6: SFT<T[T6]>, d7: SFT<T[T7]>, d8: SFT<T[T8]>) => S, S>(t1: T1, t2: T2, t3: T3, t4: T4, t5: T5, t6: T6, t7: T7, t8: T8, F: F): SF<S>;

  construct<T1 extends keyof T, T2 extends keyof T, T3 extends keyof T, T4 extends keyof T, T5 extends keyof T, T6 extends keyof T, T7 extends keyof T, T8 extends keyof T, T9 extends keyof T, F extends new (d1: SFT<T[T1]>, d2: SFT<T[T2]>, d3: SFT<T[T3]>, d4: SFT<T[T4]>, d5: SFT<T[T5]>, d6: SFT<T[T6]>, d7: SFT<T[T7]>, d8: SFT<T[T8]>, d9: SFT<T[T9]>) => S, S>(t1: T1, t2: T2, t3: T3, t4: T4, t5: T5, t6: T6, t7: T7, t8: T8, t9: T9, F: F): SF<S>;

  construct<T1 extends keyof T, T2 extends keyof T, T3 extends keyof T, T4 extends keyof T, T5 extends keyof T, T6 extends keyof T, T7 extends keyof T, T8 extends keyof T, T9 extends keyof T, T10 extends keyof T, F extends new (d1: SFT<T[T1]>, d2: SFT<T[T2]>, d3: SFT<T[T3]>, d4: SFT<T[T4]>, d5: SFT<T[T5]>, d6: SFT<T[T6]>, d7: SFT<T[T7]>, d8: SFT<T[T8]>, d9: SFT<T[T9]>, d10: SFT<T[T10]>) => S, S>(t1: T1, t2: T2, t3: T3, t4: T4, t5: T5, t6: T6, t7: T7, t8: T8, t9: T9, t10: T10, F: F): SF<S>;

}

export const constructServiceByTags = curryN(2, <Service>(
  getServiceFactory: (tag: ServiceTag) => ServiceFactory<Service>,
  serviceFactory: new(...a: any) => Service,
  ...tags: string[]): SF<Service> =>
  () => construct(serviceFactory)(...(servicesByTags as any)(getServiceFactory, ...tags)));
