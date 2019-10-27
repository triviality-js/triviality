import { curryN } from 'ramda';
import { ImmutableContainer } from '../container';
import { InferServiceTypeOfFactory as SFT, ServiceTag, SF } from '../ServiceFactory';
import { servicesByTags } from './FeatureFactoryServicesContext';

/**
 * Context for creating new service factories.
 */
export interface FeatureFactoryComposeContext<T> {
  /**
   * @typeGenerator({
   *    empty: true,
   *    templates: [
   *      "  compose<{{t% extends keyof T}}, F extends ({{d%: SFT<T[t%]>}}) => S, S>(f: F, {{k%: t%}}): SF<S>;\n"
   *    ],
   * })
   */
  compose<F extends () => S, S>(f: F): SF<S>;

  compose<t1 extends keyof T, F extends (d1: SFT<T[t1]>) => S, S>(f: F, k1: t1): SF<S>;

  compose<t1 extends keyof T, t2 extends keyof T, F extends (d1: SFT<T[t1]>, d2: SFT<T[t2]>) => S, S>(f: F, k1: t1, k2: t2): SF<S>;

  compose<t1 extends keyof T, t2 extends keyof T, t3 extends keyof T, F extends (d1: SFT<T[t1]>, d2: SFT<T[t2]>, d3: SFT<T[t3]>) => S, S>(f: F, k1: t1, k2: t2, k3: t3): SF<S>;

  compose<t1 extends keyof T, t2 extends keyof T, t3 extends keyof T, t4 extends keyof T, F extends (d1: SFT<T[t1]>, d2: SFT<T[t2]>, d3: SFT<T[t3]>, d4: SFT<T[t4]>) => S, S>(f: F, k1: t1, k2: t2, k3: t3, k4: t4): SF<S>;

  compose<t1 extends keyof T, t2 extends keyof T, t3 extends keyof T, t4 extends keyof T, t5 extends keyof T, F extends (d1: SFT<T[t1]>, d2: SFT<T[t2]>, d3: SFT<T[t3]>, d4: SFT<T[t4]>, d5: SFT<T[t5]>) => S, S>(f: F, k1: t1, k2: t2, k3: t3, k4: t4, k5: t5): SF<S>;

  compose<t1 extends keyof T, t2 extends keyof T, t3 extends keyof T, t4 extends keyof T, t5 extends keyof T, t6 extends keyof T, F extends (d1: SFT<T[t1]>, d2: SFT<T[t2]>, d3: SFT<T[t3]>, d4: SFT<T[t4]>, d5: SFT<T[t5]>, d6: SFT<T[t6]>) => S, S>(f: F, k1: t1, k2: t2, k3: t3, k4: t4, k5: t5, k6: t6): SF<S>;

  compose<t1 extends keyof T, t2 extends keyof T, t3 extends keyof T, t4 extends keyof T, t5 extends keyof T, t6 extends keyof T, t7 extends keyof T, F extends (d1: SFT<T[t1]>, d2: SFT<T[t2]>, d3: SFT<T[t3]>, d4: SFT<T[t4]>, d5: SFT<T[t5]>, d6: SFT<T[t6]>, d7: SFT<T[t7]>) => S, S>(f: F, k1: t1, k2: t2, k3: t3, k4: t4, k5: t5, k6: t6, k7: t7): SF<S>;

  compose<t1 extends keyof T, t2 extends keyof T, t3 extends keyof T, t4 extends keyof T, t5 extends keyof T, t6 extends keyof T, t7 extends keyof T, t8 extends keyof T, F extends (d1: SFT<T[t1]>, d2: SFT<T[t2]>, d3: SFT<T[t3]>, d4: SFT<T[t4]>, d5: SFT<T[t5]>, d6: SFT<T[t6]>, d7: SFT<T[t7]>, d8: SFT<T[t8]>) => S, S>(f: F, k1: t1, k2: t2, k3: t3, k4: t4, k5: t5, k6: t6, k7: t7, k8: t8): SF<S>;

  compose<t1 extends keyof T, t2 extends keyof T, t3 extends keyof T, t4 extends keyof T, t5 extends keyof T, t6 extends keyof T, t7 extends keyof T, t8 extends keyof T, t9 extends keyof T, F extends (d1: SFT<T[t1]>, d2: SFT<T[t2]>, d3: SFT<T[t3]>, d4: SFT<T[t4]>, d5: SFT<T[t5]>, d6: SFT<T[t6]>, d7: SFT<T[t7]>, d8: SFT<T[t8]>, d9: SFT<T[t9]>) => S, S>(f: F, k1: t1, k2: t2, k3: t3, k4: t4, k5: t5, k6: t6, k7: t7, k8: t8, k9: t9): SF<S>;

  compose<t1 extends keyof T, t2 extends keyof T, t3 extends keyof T, t4 extends keyof T, t5 extends keyof T, t6 extends keyof T, t7 extends keyof T, t8 extends keyof T, t9 extends keyof T, t10 extends keyof T, F extends (d1: SFT<T[t1]>, d2: SFT<T[t2]>, d3: SFT<T[t3]>, d4: SFT<T[t4]>, d5: SFT<T[t5]>, d6: SFT<T[t6]>, d7: SFT<T[t7]>, d8: SFT<T[t8]>, d9: SFT<T[t9]>, d10: SFT<T[t10]>) => S, S>(f: F, k1: t1, k2: t2, k3: t3, k4: t4, k5: t5, k6: t6, k7: t7, k8: t8, k9: t9, k10: t10): SF<S>;

}

export const composeServiceByTags = curryN(2, <Service>(
  getServiceFactory: (tag: ServiceTag) => SF<Service>,
  serviceFactory: (...services: any[]) => Service,
  ...tags: string[]): SF<Service> => {
  return () => serviceFactory(...(servicesByTags as any)(getServiceFactory, ...tags).map((sf: any) => sf()));
});

export const createFeatureFactoryComposeContext = (container: ImmutableContainer): FeatureFactoryComposeContext<any> => ({
  compose: composeServiceByTags(container.getService),
});
