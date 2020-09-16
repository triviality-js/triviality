import { SF } from '../ServiceFactory';
import { GetService, servicesByTags } from './ServicesContext';
import { curryN } from 'lodash/fp';

/**
 * Context for creating new service factories.
 */
export interface ComposeContext<T> {
  /**
   * @typeGenerator({
   *    empty: true,
   *    templates: [
   *      "  compose<{{t% extends keyof T}}, F extends ({{d%: T[t%]}}) => S, S>(f: F, {{k%: t%}}): SF<S>;\n"
   *    ],
   * })
   */
  compose<F extends () => S, S>(f: F): SF<S>;

  compose<t1 extends keyof T, F extends (d1: T[t1]) => S, S>(f: F, k1: t1): SF<S>;

  compose<t1 extends keyof T, t2 extends keyof T, F extends (d1: T[t1], d2: T[t2]) => S, S>(f: F, k1: t1, k2: t2): SF<S>;

  compose<t1 extends keyof T, t2 extends keyof T, t3 extends keyof T, F extends (d1: T[t1], d2: T[t2], d3: T[t3]) => S, S>(f: F, k1: t1, k2: t2, k3: t3): SF<S>;

  compose<t1 extends keyof T, t2 extends keyof T, t3 extends keyof T, t4 extends keyof T, F extends (d1: T[t1], d2: T[t2], d3: T[t3], d4: T[t4]) => S, S>(f: F, k1: t1, k2: t2, k3: t3, k4: t4): SF<S>;

  compose<t1 extends keyof T, t2 extends keyof T, t3 extends keyof T, t4 extends keyof T, t5 extends keyof T, F extends (d1: T[t1], d2: T[t2], d3: T[t3], d4: T[t4], d5: T[t5]) => S, S>(f: F, k1: t1, k2: t2, k3: t3, k4: t4, k5: t5): SF<S>;

  compose<t1 extends keyof T, t2 extends keyof T, t3 extends keyof T, t4 extends keyof T, t5 extends keyof T, t6 extends keyof T, F extends (d1: T[t1], d2: T[t2], d3: T[t3], d4: T[t4], d5: T[t5], d6: T[t6]) => S, S>(f: F, k1: t1, k2: t2, k3: t3, k4: t4, k5: t5, k6: t6): SF<S>;

  compose<t1 extends keyof T, t2 extends keyof T, t3 extends keyof T, t4 extends keyof T, t5 extends keyof T, t6 extends keyof T, t7 extends keyof T, F extends (d1: T[t1], d2: T[t2], d3: T[t3], d4: T[t4], d5: T[t5], d6: T[t6], d7: T[t7]) => S, S>(f: F, k1: t1, k2: t2, k3: t3, k4: t4, k5: t5, k6: t6, k7: t7): SF<S>;

  compose<t1 extends keyof T, t2 extends keyof T, t3 extends keyof T, t4 extends keyof T, t5 extends keyof T, t6 extends keyof T, t7 extends keyof T, t8 extends keyof T, F extends (d1: T[t1], d2: T[t2], d3: T[t3], d4: T[t4], d5: T[t5], d6: T[t6], d7: T[t7], d8: T[t8]) => S, S>(f: F, k1: t1, k2: t2, k3: t3, k4: t4, k5: t5, k6: t6, k7: t7, k8: t8): SF<S>;

  compose<t1 extends keyof T, t2 extends keyof T, t3 extends keyof T, t4 extends keyof T, t5 extends keyof T, t6 extends keyof T, t7 extends keyof T, t8 extends keyof T, t9 extends keyof T, F extends (d1: T[t1], d2: T[t2], d3: T[t3], d4: T[t4], d5: T[t5], d6: T[t6], d7: T[t7], d8: T[t8], d9: T[t9]) => S, S>(f: F, k1: t1, k2: t2, k3: t3, k4: t4, k5: t5, k6: t6, k7: t7, k8: t8, k9: t9): SF<S>;

  compose<t1 extends keyof T, t2 extends keyof T, t3 extends keyof T, t4 extends keyof T, t5 extends keyof T, t6 extends keyof T, t7 extends keyof T, t8 extends keyof T, t9 extends keyof T, t10 extends keyof T, F extends (d1: T[t1], d2: T[t2], d3: T[t3], d4: T[t4], d5: T[t5], d6: T[t6], d7: T[t7], d8: T[t8], d9: T[t9], d10: T[t10]) => S, S>(f: F, k1: t1, k2: t2, k3: t3, k4: t4, k5: t5, k6: t6, k7: t7, k8: t8, k9: t9, k10: t10): SF<S>;
}

export const composeServiceByTags = curryN(2, <Service>(
  getServiceFactory: (...tag: string[]) => SF<Service>,
  serviceFactory: (...services: any[]) => Service,
  ...tags: string[]): SF<Service> => {
  return () => serviceFactory(...servicesByTags(getServiceFactory)(...(tags as [string])).map((sf: SF) => sf()));
});

export const createFeatureFactoryComposeContext = <TServices>(getService: GetService<TServices>): ComposeContext<TServices> => ({
  compose: composeServiceByTags(getService),
});
