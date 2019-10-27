import { curry, curryN } from 'ramda';
import { MutableContainer } from '../container';
import { InferServiceTypeOfFactory as SFT, ServiceTag, SF } from '../ServiceFactory';
import { composeServiceByTags } from './FeatureFactoryComposeContext';
import { constructServiceByTags } from './FeatureFactoryConstructContext';

type OverrideReturn<T> = [T, T];

/**
 * Context for overriding services.
 */
export interface FeatureFactoryOverrideContext<T> {
  override<O extends keyof T>(serviceTagToOverride: T, overrideWith: T[O]): OverrideReturn<T[O]>;

  /**
   * TODO: Add type verification.
   */
  overrideWith<OverrideTag extends keyof T, WithTag extends keyof T>(serviceTagToOverride: T, overrideWith: WithTag): OverrideReturn<T[OverrideTag]>;

  overrideBy<OverrideTag extends keyof T>(serviceTagToOverride: T, overrideWith: (getServiceWithOriginal: <TAG extends keyof T>(tag: TAG) => T[TAG]) => T[OverrideTag]): OverrideReturn<T[OverrideTag]>;

  /**
   * @typeGenerator({
   *    empty: true,
   *    templates: [
   *      "  composeOverride<O extends keyof T, {{t% extends keyof T}}, W extends ({{d%: SFT<T[t%]>}}) => T[O]>(serviceTagToOverride: O, overrideWith: W, {{k%: t%}}): OverrideReturn<T[O]>;\n"
   *    ],
   * })
   */
  composeOverride<O extends keyof T,  W extends () => T[O]>(serviceTagToOverride: O, overrideWith: W): OverrideReturn<T[O]>;

  composeOverride<O extends keyof T, t1 extends keyof T, W extends (d1: SFT<T[t1]>) => T[O]>(serviceTagToOverride: O, overrideWith: W, k1: t1): OverrideReturn<T[O]>;

  composeOverride<O extends keyof T, t1 extends keyof T, t2 extends keyof T, W extends (d1: SFT<T[t1]>, d2: SFT<T[t2]>) => T[O]>(serviceTagToOverride: O, overrideWith: W, k1: t1, k2: t2): OverrideReturn<T[O]>;

  composeOverride<O extends keyof T, t1 extends keyof T, t2 extends keyof T, t3 extends keyof T, W extends (d1: SFT<T[t1]>, d2: SFT<T[t2]>, d3: SFT<T[t3]>) => T[O]>(serviceTagToOverride: O, overrideWith: W, k1: t1, k2: t2, k3: t3): OverrideReturn<T[O]>;

  composeOverride<O extends keyof T, t1 extends keyof T, t2 extends keyof T, t3 extends keyof T, t4 extends keyof T, W extends (d1: SFT<T[t1]>, d2: SFT<T[t2]>, d3: SFT<T[t3]>, d4: SFT<T[t4]>) => T[O]>(serviceTagToOverride: O, overrideWith: W, k1: t1, k2: t2, k3: t3, k4: t4): OverrideReturn<T[O]>;

  composeOverride<O extends keyof T, t1 extends keyof T, t2 extends keyof T, t3 extends keyof T, t4 extends keyof T, t5 extends keyof T, W extends (d1: SFT<T[t1]>, d2: SFT<T[t2]>, d3: SFT<T[t3]>, d4: SFT<T[t4]>, d5: SFT<T[t5]>) => T[O]>(serviceTagToOverride: O, overrideWith: W, k1: t1, k2: t2, k3: t3, k4: t4, k5: t5): OverrideReturn<T[O]>;

  composeOverride<O extends keyof T, t1 extends keyof T, t2 extends keyof T, t3 extends keyof T, t4 extends keyof T, t5 extends keyof T, t6 extends keyof T, W extends (d1: SFT<T[t1]>, d2: SFT<T[t2]>, d3: SFT<T[t3]>, d4: SFT<T[t4]>, d5: SFT<T[t5]>, d6: SFT<T[t6]>) => T[O]>(serviceTagToOverride: O, overrideWith: W, k1: t1, k2: t2, k3: t3, k4: t4, k5: t5, k6: t6): OverrideReturn<T[O]>;

  composeOverride<O extends keyof T, t1 extends keyof T, t2 extends keyof T, t3 extends keyof T, t4 extends keyof T, t5 extends keyof T, t6 extends keyof T, t7 extends keyof T, W extends (d1: SFT<T[t1]>, d2: SFT<T[t2]>, d3: SFT<T[t3]>, d4: SFT<T[t4]>, d5: SFT<T[t5]>, d6: SFT<T[t6]>, d7: SFT<T[t7]>) => T[O]>(serviceTagToOverride: O, overrideWith: W, k1: t1, k2: t2, k3: t3, k4: t4, k5: t5, k6: t6, k7: t7): OverrideReturn<T[O]>;

  composeOverride<O extends keyof T, t1 extends keyof T, t2 extends keyof T, t3 extends keyof T, t4 extends keyof T, t5 extends keyof T, t6 extends keyof T, t7 extends keyof T, t8 extends keyof T, W extends (d1: SFT<T[t1]>, d2: SFT<T[t2]>, d3: SFT<T[t3]>, d4: SFT<T[t4]>, d5: SFT<T[t5]>, d6: SFT<T[t6]>, d7: SFT<T[t7]>, d8: SFT<T[t8]>) => T[O]>(serviceTagToOverride: O, overrideWith: W, k1: t1, k2: t2, k3: t3, k4: t4, k5: t5, k6: t6, k7: t7, k8: t8): OverrideReturn<T[O]>;

  composeOverride<O extends keyof T, t1 extends keyof T, t2 extends keyof T, t3 extends keyof T, t4 extends keyof T, t5 extends keyof T, t6 extends keyof T, t7 extends keyof T, t8 extends keyof T, t9 extends keyof T, W extends (d1: SFT<T[t1]>, d2: SFT<T[t2]>, d3: SFT<T[t3]>, d4: SFT<T[t4]>, d5: SFT<T[t5]>, d6: SFT<T[t6]>, d7: SFT<T[t7]>, d8: SFT<T[t8]>, d9: SFT<T[t9]>) => T[O]>(serviceTagToOverride: O, overrideWith: W, k1: t1, k2: t2, k3: t3, k4: t4, k5: t5, k6: t6, k7: t7, k8: t8, k9: t9): OverrideReturn<T[O]>;

  composeOverride<O extends keyof T, t1 extends keyof T, t2 extends keyof T, t3 extends keyof T, t4 extends keyof T, t5 extends keyof T, t6 extends keyof T, t7 extends keyof T, t8 extends keyof T, t9 extends keyof T, t10 extends keyof T, W extends (d1: SFT<T[t1]>, d2: SFT<T[t2]>, d3: SFT<T[t3]>, d4: SFT<T[t4]>, d5: SFT<T[t5]>, d6: SFT<T[t6]>, d7: SFT<T[t7]>, d8: SFT<T[t8]>, d9: SFT<T[t9]>, d10: SFT<T[t10]>) => T[O]>(serviceTagToOverride: O, overrideWith: W, k1: t1, k2: t2, k3: t3, k4: t4, k5: t5, k6: t6, k7: t7, k8: t8, k9: t9, k10: t10): OverrideReturn<T[O]>;

  /**
   * @typeGenerator({
   *  empty: true,
   *  templates: [
   *    "  constructOverride<{{T% extends keyof T}}, F extends new ({{d%: SFT<T[T%]>}}) => S, S>({{t%: T%}}, F: F): [SF<S>, SF<S>];\n"
   *   ],
   * })
   */
  constructOverride<F extends new () => S, S>(F: F): [SF<S>, SF<S>];

  constructOverride<T1 extends keyof T, F extends new (d1: SFT<T[T1]>) => S, S>(t1: T1, F: F): [SF<S>, SF<S>];

  constructOverride<T1 extends keyof T, T2 extends keyof T, F extends new (d1: SFT<T[T1]>, d2: SFT<T[T2]>) => S, S>(t1: T1, t2: T2, F: F): [SF<S>, SF<S>];

  constructOverride<T1 extends keyof T, T2 extends keyof T, T3 extends keyof T, F extends new (d1: SFT<T[T1]>, d2: SFT<T[T2]>, d3: SFT<T[T3]>) => S, S>(t1: T1, t2: T2, t3: T3, F: F): [SF<S>, SF<S>];

  constructOverride<T1 extends keyof T, T2 extends keyof T, T3 extends keyof T, T4 extends keyof T, F extends new (d1: SFT<T[T1]>, d2: SFT<T[T2]>, d3: SFT<T[T3]>, d4: SFT<T[T4]>) => S, S>(t1: T1, t2: T2, t3: T3, t4: T4, F: F): [SF<S>, SF<S>];

  constructOverride<T1 extends keyof T, T2 extends keyof T, T3 extends keyof T, T4 extends keyof T, T5 extends keyof T, F extends new (d1: SFT<T[T1]>, d2: SFT<T[T2]>, d3: SFT<T[T3]>, d4: SFT<T[T4]>, d5: SFT<T[T5]>) => S, S>(t1: T1, t2: T2, t3: T3, t4: T4, t5: T5, F: F): [SF<S>, SF<S>];

  constructOverride<T1 extends keyof T, T2 extends keyof T, T3 extends keyof T, T4 extends keyof T, T5 extends keyof T, T6 extends keyof T, F extends new (d1: SFT<T[T1]>, d2: SFT<T[T2]>, d3: SFT<T[T3]>, d4: SFT<T[T4]>, d5: SFT<T[T5]>, d6: SFT<T[T6]>) => S, S>(t1: T1, t2: T2, t3: T3, t4: T4, t5: T5, t6: T6, F: F): [SF<S>, SF<S>];

  constructOverride<T1 extends keyof T, T2 extends keyof T, T3 extends keyof T, T4 extends keyof T, T5 extends keyof T, T6 extends keyof T, T7 extends keyof T, F extends new (d1: SFT<T[T1]>, d2: SFT<T[T2]>, d3: SFT<T[T3]>, d4: SFT<T[T4]>, d5: SFT<T[T5]>, d6: SFT<T[T6]>, d7: SFT<T[T7]>) => S, S>(t1: T1, t2: T2, t3: T3, t4: T4, t5: T5, t6: T6, t7: T7, F: F): [SF<S>, SF<S>];

  constructOverride<T1 extends keyof T, T2 extends keyof T, T3 extends keyof T, T4 extends keyof T, T5 extends keyof T, T6 extends keyof T, T7 extends keyof T, T8 extends keyof T, F extends new (d1: SFT<T[T1]>, d2: SFT<T[T2]>, d3: SFT<T[T3]>, d4: SFT<T[T4]>, d5: SFT<T[T5]>, d6: SFT<T[T6]>, d7: SFT<T[T7]>, d8: SFT<T[T8]>) => S, S>(t1: T1, t2: T2, t3: T3, t4: T4, t5: T5, t6: T6, t7: T7, t8: T8, F: F): [SF<S>, SF<S>];

  constructOverride<T1 extends keyof T, T2 extends keyof T, T3 extends keyof T, T4 extends keyof T, T5 extends keyof T, T6 extends keyof T, T7 extends keyof T, T8 extends keyof T, T9 extends keyof T, F extends new (d1: SFT<T[T1]>, d2: SFT<T[T2]>, d3: SFT<T[T3]>, d4: SFT<T[T4]>, d5: SFT<T[T5]>, d6: SFT<T[T6]>, d7: SFT<T[T7]>, d8: SFT<T[T8]>, d9: SFT<T[T9]>) => S, S>(t1: T1, t2: T2, t3: T3, t4: T4, t5: T5, t6: T6, t7: T7, t8: T8, t9: T9, F: F): [SF<S>, SF<S>];

  constructOverride<T1 extends keyof T, T2 extends keyof T, T3 extends keyof T, T4 extends keyof T, T5 extends keyof T, T6 extends keyof T, T7 extends keyof T, T8 extends keyof T, T9 extends keyof T, T10 extends keyof T, F extends new (d1: SFT<T[T1]>, d2: SFT<T[T2]>, d3: SFT<T[T3]>, d4: SFT<T[T4]>, d5: SFT<T[T5]>, d6: SFT<T[T6]>, d7: SFT<T[T7]>, d8: SFT<T[T8]>, d9: SFT<T[T9]>, d10: SFT<T[T10]>) => S, S>(t1: T1, t2: T2, t3: T3, t4: T4, t5: T5, t6: T6, t7: T7, t8: T8, t9: T9, t10: T10, F: F): [SF<S>, SF<S>];

}

export const createFeatureFactoryOverrideContext = (container: MutableContainer): FeatureFactoryOverrideContext<any> => ({
  overrideBy: overrideBy(container) as any,
  override: overrideService(container) as any,
  overrideWith: overrideWithServiceTag(container) as any,
  composeOverride: composeOverride(container) as any,
  constructOverride: constructOverride(container) as any,
});

export const overrideWithServiceTag = curry((container: MutableContainer, serviceTagToOverride: ServiceTag, overrideWith: ServiceTag) =>
  overrideBy(container, serviceTagToOverride, (service) => service(overrideWith)));

export const overrideService = curry((container: MutableContainer, serviceTagToOverride: ServiceTag, overrideWith: SF): [SF, SF] =>
  overrideBy(container, serviceTagToOverride, () => overrideWith));

export const overrideBy = curry((container: MutableContainer, serviceTagToOverride: ServiceTag, overrideWith: (getService: (tag: ServiceTag) => SF) => SF): [SF, SF] => {
  const { getService, setService, getCurrentService } = container;
  const original = getCurrentService(serviceTagToOverride);
  setService(serviceTagToOverride, overrideWith((tag: ServiceTag) => tag === serviceTagToOverride ? original : getService(tag)));
  return [original, getService(serviceTagToOverride)] as any;
});

export const composeOverride = curryN(2, (container: MutableContainer, serviceTagToOverride: ServiceTag, overrideWith: (...services: any[]) => SF, ...tags: ServiceTag[]): [SF, SF] =>
  overrideBy(container, serviceTagToOverride, (serviceWithOriginal) =>
    composeServiceByTags(
      serviceWithOriginal,
      overrideWith,
      ...tags,
    )));

export const constructOverride = curryN(2, (
  container: MutableContainer,
  serviceTagToOverride: ServiceTag,
  serviceFactory: new(...a: any) => unknown,
  ...tags: string[]): [SF, SF] =>
  overrideBy(container, serviceTagToOverride, (serviceWithOriginal) =>
    constructServiceByTags(
      serviceWithOriginal,
      serviceFactory,
      ...tags,
    )));
