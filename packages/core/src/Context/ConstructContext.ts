import { ImmutableContainer } from '../Container';
import { ServiceFactory, ServiceTag, SF } from '../ServiceFactory';

/**
 * Context for constructing new services.
 */
export interface ConstructContext<T> {
  /**
   * @typeGenerator({
   *  empty: true,
   *  templates: [
   *    "  construct<{{T% extends keyof T}}, F extends new ({{d%: T[T%]}}) => S, S>(F: F, {{t%: T%}}): SF<S>;\n"
   *   ],
   * })
   */
  construct<F extends new () => S, S>(F: F): SF<S>;

  construct<T1 extends keyof T, F extends new (d1: T[T1]) => S, S>(F: F, t1: T1): SF<S>;

  construct<T1 extends keyof T, T2 extends keyof T, F extends new (d1: T[T1], d2: T[T2]) => S, S>(F: F, t1: T1, t2: T2): SF<S>;

  construct<T1 extends keyof T, T2 extends keyof T, T3 extends keyof T, F extends new (d1: T[T1], d2: T[T2], d3: T[T3]) => S, S>(F: F, t1: T1, t2: T2, t3: T3): SF<S>;

  construct<T1 extends keyof T, T2 extends keyof T, T3 extends keyof T, T4 extends keyof T, F extends new (d1: T[T1], d2: T[T2], d3: T[T3], d4: T[T4]) => S, S>(F: F, t1: T1, t2: T2, t3: T3, t4: T4): SF<S>;

  construct<T1 extends keyof T, T2 extends keyof T, T3 extends keyof T, T4 extends keyof T, T5 extends keyof T, F extends new (d1: T[T1], d2: T[T2], d3: T[T3], d4: T[T4], d5: T[T5]) => S, S>(F: F, t1: T1, t2: T2, t3: T3, t4: T4, t5: T5): SF<S>;

  construct<T1 extends keyof T, T2 extends keyof T, T3 extends keyof T, T4 extends keyof T, T5 extends keyof T, T6 extends keyof T, F extends new (d1: T[T1], d2: T[T2], d3: T[T3], d4: T[T4], d5: T[T5], d6: T[T6]) => S, S>(F: F, t1: T1, t2: T2, t3: T3, t4: T4, t5: T5, t6: T6): SF<S>;

  construct<T1 extends keyof T, T2 extends keyof T, T3 extends keyof T, T4 extends keyof T, T5 extends keyof T, T6 extends keyof T, T7 extends keyof T, F extends new (d1: T[T1], d2: T[T2], d3: T[T3], d4: T[T4], d5: T[T5], d6: T[T6], d7: T[T7]) => S, S>(F: F, t1: T1, t2: T2, t3: T3, t4: T4, t5: T5, t6: T6, t7: T7): SF<S>;

  construct<T1 extends keyof T, T2 extends keyof T, T3 extends keyof T, T4 extends keyof T, T5 extends keyof T, T6 extends keyof T, T7 extends keyof T, T8 extends keyof T, F extends new (d1: T[T1], d2: T[T2], d3: T[T3], d4: T[T4], d5: T[T5], d6: T[T6], d7: T[T7], d8: T[T8]) => S, S>(F: F, t1: T1, t2: T2, t3: T3, t4: T4, t5: T5, t6: T6, t7: T7, t8: T8): SF<S>;

  construct<T1 extends keyof T, T2 extends keyof T, T3 extends keyof T, T4 extends keyof T, T5 extends keyof T, T6 extends keyof T, T7 extends keyof T, T8 extends keyof T, T9 extends keyof T, F extends new (d1: T[T1], d2: T[T2], d3: T[T3], d4: T[T4], d5: T[T5], d6: T[T6], d7: T[T7], d8: T[T8], d9: T[T9]) => S, S>(F: F, t1: T1, t2: T2, t3: T3, t4: T4, t5: T5, t6: T6, t7: T7, t8: T8, t9: T9): SF<S>;

  construct<T1 extends keyof T, T2 extends keyof T, T3 extends keyof T, T4 extends keyof T, T5 extends keyof T, T6 extends keyof T, T7 extends keyof T, T8 extends keyof T, T9 extends keyof T, T10 extends keyof T, F extends new (d1: T[T1], d2: T[T2], d3: T[T3], d4: T[T4], d5: T[T5], d6: T[T6], d7: T[T7], d8: T[T8], d9: T[T9], d10: T[T10]) => S, S>(F: F, t1: T1, t2: T2, t3: T3, t4: T4, t5: T5, t6: T6, t7: T7, t8: T8, t9: T9, t10: T10): SF<S>;

}

export const createFeatureFactoryConstructContext = ({ getService }: ImmutableContainer) => ({
  construct: constructServiceByTags(getService),
});

export const constructServiceByTags = (getServiceFactory: (tag: ServiceTag) => ServiceFactory) => <Service>(
  serviceFactory: new(...a: any) => Service,
  ...tags: string[]): SF<Service> =>
  () => new serviceFactory(...tags.map(getServiceFactory).map((sf) => sf()));
