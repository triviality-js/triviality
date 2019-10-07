import { ServiceFactory, ServiceTag, SF, TSF } from '../ServiceFactory';

/**
 * Context helper for retrieving services from context.
 */
export interface FeatureFactoryServicesContext<T> {
  /**
   * @typeGenerator({ templates: ["  services<{{K% extends keyof T}}>({{t%: K%}}): [{{T[K%]}}];\n"] })
   */
  services<K1 extends keyof T>(t1: K1): [T[K1]];

  services<K1 extends keyof T, K2 extends keyof T>(t1: K1, t2: K2): [T[K1], T[K2]];

  services<K1 extends keyof T, K2 extends keyof T, K3 extends keyof T>(t1: K1, t2: K2, t3: K3): [T[K1], T[K2], T[K3]];

  services<K1 extends keyof T, K2 extends keyof T, K3 extends keyof T, K4 extends keyof T>(t1: K1, t2: K2, t3: K3, t4: K4): [T[K1], T[K2], T[K3], T[K4]];

  services<K1 extends keyof T, K2 extends keyof T, K3 extends keyof T, K4 extends keyof T, K5 extends keyof T>(t1: K1, t2: K2, t3: K3, t4: K4, t5: K5): [T[K1], T[K2], T[K3], T[K4], T[K5]];

  services<K1 extends keyof T, K2 extends keyof T, K3 extends keyof T, K4 extends keyof T, K5 extends keyof T, K6 extends keyof T>(t1: K1, t2: K2, t3: K3, t4: K4, t5: K5, t6: K6): [T[K1], T[K2], T[K3], T[K4], T[K5], T[K6]];

  services<K1 extends keyof T, K2 extends keyof T, K3 extends keyof T, K4 extends keyof T, K5 extends keyof T, K6 extends keyof T, K7 extends keyof T>(t1: K1, t2: K2, t3: K3, t4: K4, t5: K5, t6: K6, t7: K7): [T[K1], T[K2], T[K3], T[K4], T[K5], T[K6], T[K7]];

  services<K1 extends keyof T, K2 extends keyof T, K3 extends keyof T, K4 extends keyof T, K5 extends keyof T, K6 extends keyof T, K7 extends keyof T, K8 extends keyof T>(t1: K1, t2: K2, t3: K3, t4: K4, t5: K5, t6: K6, t7: K7, t8: K8): [T[K1], T[K2], T[K3], T[K4], T[K5], T[K6], T[K7], T[K8]];

  services<K1 extends keyof T, K2 extends keyof T, K3 extends keyof T, K4 extends keyof T, K5 extends keyof T, K6 extends keyof T, K7 extends keyof T, K8 extends keyof T, K9 extends keyof T>(t1: K1, t2: K2, t3: K3, t4: K4, t5: K5, t6: K6, t7: K7, t8: K8, t9: K9): [T[K1], T[K2], T[K3], T[K4], T[K5], T[K6], T[K7], T[K8], T[K9]];

  services<K1 extends keyof T, K2 extends keyof T, K3 extends keyof T, K4 extends keyof T, K5 extends keyof T, K6 extends keyof T, K7 extends keyof T, K8 extends keyof T, K9 extends keyof T, K10 extends keyof T>(t1: K1, t2: K2, t3: K3, t4: K4, t5: K5, t6: K6, t7: K7, t8: K8, t9: K9, t10: K10): [T[K1], T[K2], T[K3], T[K4], T[K5], T[K6], T[K7], T[K8], T[K9], T[K10]];

}

/**
 * @typeGenerator({
 *  templates: [
 *    // Service by '(tag) => service' with currying.
 *    "export function servicesByTags<{{T%, S% extends SF}}>(serviceByTag: {{TSF<T%, S%> - | }}, {{t%: T%}}): [{{S%}}];",
 *    "export function servicesByTags<{{T%, S% extends SF}}>(serviceByTag: {{TSF<T%, S%> - | }}): ({{t%: T%}}) => [{{S%}}];",
 *  ],
 * })
 */
export function servicesByTags<T1, S1 extends SF>(serviceByTag: TSF<T1, S1>, t1: T1): [S1];
export function servicesByTags<T1, S1 extends SF>(serviceByTag: TSF<T1, S1>): (t1: T1) => [S1];
export function servicesByTags<T1, S1 extends SF, T2, S2 extends SF>(serviceByTag: TSF<T1, S1> | TSF<T2, S2>, t1: T1, t2: T2): [S1, S2];
export function servicesByTags<T1, S1 extends SF, T2, S2 extends SF>(serviceByTag: TSF<T1, S1> | TSF<T2, S2>): (t1: T1, t2: T2) => [S1, S2];
export function servicesByTags<T1, S1 extends SF, T2, S2 extends SF, T3, S3 extends SF>(serviceByTag: TSF<T1, S1> | TSF<T2, S2> | TSF<T3, S3>, t1: T1, t2: T2, t3: T3): [S1, S2, S3];
export function servicesByTags<T1, S1 extends SF, T2, S2 extends SF, T3, S3 extends SF>(serviceByTag: TSF<T1, S1> | TSF<T2, S2> | TSF<T3, S3>): (t1: T1, t2: T2, t3: T3) => [S1, S2, S3];
export function servicesByTags<T1, S1 extends SF, T2, S2 extends SF, T3, S3 extends SF, T4, S4 extends SF>(serviceByTag: TSF<T1, S1> | TSF<T2, S2> | TSF<T3, S3> | TSF<T4, S4>, t1: T1, t2: T2, t3: T3, t4: T4): [S1, S2, S3, S4];
export function servicesByTags<T1, S1 extends SF, T2, S2 extends SF, T3, S3 extends SF, T4, S4 extends SF>(serviceByTag: TSF<T1, S1> | TSF<T2, S2> | TSF<T3, S3> | TSF<T4, S4>): (t1: T1, t2: T2, t3: T3, t4: T4) => [S1, S2, S3, S4];
export function servicesByTags<T1, S1 extends SF, T2, S2 extends SF, T3, S3 extends SF, T4, S4 extends SF, T5, S5 extends SF>(serviceByTag: TSF<T1, S1> | TSF<T2, S2> | TSF<T3, S3> | TSF<T4, S4> | TSF<T5, S5>, t1: T1, t2: T2, t3: T3, t4: T4, t5: T5): [S1, S2, S3, S4, S5];
export function servicesByTags<T1, S1 extends SF, T2, S2 extends SF, T3, S3 extends SF, T4, S4 extends SF, T5, S5 extends SF>(serviceByTag: TSF<T1, S1> | TSF<T2, S2> | TSF<T3, S3> | TSF<T4, S4> | TSF<T5, S5>): (t1: T1, t2: T2, t3: T3, t4: T4, t5: T5) => [S1, S2, S3, S4, S5];
export function servicesByTags<T1, S1 extends SF, T2, S2 extends SF, T3, S3 extends SF, T4, S4 extends SF, T5, S5 extends SF, T6, S6 extends SF>(serviceByTag: TSF<T1, S1> | TSF<T2, S2> | TSF<T3, S3> | TSF<T4, S4> | TSF<T5, S5> | TSF<T6, S6>, t1: T1, t2: T2, t3: T3, t4: T4, t5: T5, t6: T6): [S1, S2, S3, S4, S5, S6];
export function servicesByTags<T1, S1 extends SF, T2, S2 extends SF, T3, S3 extends SF, T4, S4 extends SF, T5, S5 extends SF, T6, S6 extends SF>(serviceByTag: TSF<T1, S1> | TSF<T2, S2> | TSF<T3, S3> | TSF<T4, S4> | TSF<T5, S5> | TSF<T6, S6>): (t1: T1, t2: T2, t3: T3, t4: T4, t5: T5, t6: T6) => [S1, S2, S3, S4, S5, S6];
export function servicesByTags<T1, S1 extends SF, T2, S2 extends SF, T3, S3 extends SF, T4, S4 extends SF, T5, S5 extends SF, T6, S6 extends SF, T7, S7 extends SF>(serviceByTag: TSF<T1, S1> | TSF<T2, S2> | TSF<T3, S3> | TSF<T4, S4> | TSF<T5, S5> | TSF<T6, S6> | TSF<T7, S7>, t1: T1, t2: T2, t3: T3, t4: T4, t5: T5, t6: T6, t7: T7): [S1, S2, S3, S4, S5, S6, S7];
export function servicesByTags<T1, S1 extends SF, T2, S2 extends SF, T3, S3 extends SF, T4, S4 extends SF, T5, S5 extends SF, T6, S6 extends SF, T7, S7 extends SF>(serviceByTag: TSF<T1, S1> | TSF<T2, S2> | TSF<T3, S3> | TSF<T4, S4> | TSF<T5, S5> | TSF<T6, S6> | TSF<T7, S7>): (t1: T1, t2: T2, t3: T3, t4: T4, t5: T5, t6: T6, t7: T7) => [S1, S2, S3, S4, S5, S6, S7];
export function servicesByTags<T1, S1 extends SF, T2, S2 extends SF, T3, S3 extends SF, T4, S4 extends SF, T5, S5 extends SF, T6, S6 extends SF, T7, S7 extends SF, T8, S8 extends SF>(serviceByTag: TSF<T1, S1> | TSF<T2, S2> | TSF<T3, S3> | TSF<T4, S4> | TSF<T5, S5> | TSF<T6, S6> | TSF<T7, S7> | TSF<T8, S8>, t1: T1, t2: T2, t3: T3, t4: T4, t5: T5, t6: T6, t7: T7, t8: T8): [S1, S2, S3, S4, S5, S6, S7, S8];
export function servicesByTags<T1, S1 extends SF, T2, S2 extends SF, T3, S3 extends SF, T4, S4 extends SF, T5, S5 extends SF, T6, S6 extends SF, T7, S7 extends SF, T8, S8 extends SF>(serviceByTag: TSF<T1, S1> | TSF<T2, S2> | TSF<T3, S3> | TSF<T4, S4> | TSF<T5, S5> | TSF<T6, S6> | TSF<T7, S7> | TSF<T8, S8>): (t1: T1, t2: T2, t3: T3, t4: T4, t5: T5, t6: T6, t7: T7, t8: T8) => [S1, S2, S3, S4, S5, S6, S7, S8];
export function servicesByTags<T1, S1 extends SF, T2, S2 extends SF, T3, S3 extends SF, T4, S4 extends SF, T5, S5 extends SF, T6, S6 extends SF, T7, S7 extends SF, T8, S8 extends SF, T9, S9 extends SF>(serviceByTag: TSF<T1, S1> | TSF<T2, S2> | TSF<T3, S3> | TSF<T4, S4> | TSF<T5, S5> | TSF<T6, S6> | TSF<T7, S7> | TSF<T8, S8> | TSF<T9, S9>, t1: T1, t2: T2, t3: T3, t4: T4, t5: T5, t6: T6, t7: T7, t8: T8, t9: T9): [S1, S2, S3, S4, S5, S6, S7, S8, S9];
export function servicesByTags<T1, S1 extends SF, T2, S2 extends SF, T3, S3 extends SF, T4, S4 extends SF, T5, S5 extends SF, T6, S6 extends SF, T7, S7 extends SF, T8, S8 extends SF, T9, S9 extends SF>(serviceByTag: TSF<T1, S1> | TSF<T2, S2> | TSF<T3, S3> | TSF<T4, S4> | TSF<T5, S5> | TSF<T6, S6> | TSF<T7, S7> | TSF<T8, S8> | TSF<T9, S9>): (t1: T1, t2: T2, t3: T3, t4: T4, t5: T5, t6: T6, t7: T7, t8: T8, t9: T9) => [S1, S2, S3, S4, S5, S6, S7, S8, S9];
export function servicesByTags<T1, S1 extends SF, T2, S2 extends SF, T3, S3 extends SF, T4, S4 extends SF, T5, S5 extends SF, T6, S6 extends SF, T7, S7 extends SF, T8, S8 extends SF, T9, S9 extends SF, T10, S10 extends SF>(serviceByTag: TSF<T1, S1> | TSF<T2, S2> | TSF<T3, S3> | TSF<T4, S4> | TSF<T5, S5> | TSF<T6, S6> | TSF<T7, S7> | TSF<T8, S8> | TSF<T9, S9> | TSF<T10, S10>, t1: T1, t2: T2, t3: T3, t4: T4, t5: T5, t6: T6, t7: T7, t8: T8, t9: T9, t10: T10): [S1, S2, S3, S4, S5, S6, S7, S8, S9, S10];
export function servicesByTags<T1, S1 extends SF, T2, S2 extends SF, T3, S3 extends SF, T4, S4 extends SF, T5, S5 extends SF, T6, S6 extends SF, T7, S7 extends SF, T8, S8 extends SF, T9, S9 extends SF, T10, S10 extends SF>(serviceByTag: TSF<T1, S1> | TSF<T2, S2> | TSF<T3, S3> | TSF<T4, S4> | TSF<T5, S5> | TSF<T6, S6> | TSF<T7, S7> | TSF<T8, S8> | TSF<T9, S9> | TSF<T10, S10>): (t1: T1, t2: T2, t3: T3, t4: T4, t5: T5, t6: T6, t7: T7, t8: T8, t9: T9, t10: T10) => [S1, S2, S3, S4, S5, S6, S7, S8, S9, S10];
export function servicesByTags(getServiceFactory: (tag: ServiceTag) => ServiceFactory<any>, ...serviceTags: string[]): any {
  if (serviceTags.length === 0) {
    return (...tags: string[]) => {
      return (servicesByTags as any)(getServiceFactory, ...tags);
    };
  }
  return serviceTags.map((tag) => {
    return () => getServiceFactory(tag)();
  });
}
