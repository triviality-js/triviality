import {FeatureFactory, ServicesAsFactories as SAF, SF} from "../Value";

export interface MergeOptions {
  /**
   * Name of the group.
   */
  name: string;
}

/**
 *
 */
export interface MergeWith<T> {
  /**
   * Add extra feature to this merge.
   */
  with<ExtendWith>(featureFactory: FeatureFactory<ExtendWith, T>): MergeWith<T & ExtendWith>;

  /**
   * Return all new services.
   */
  create(options?: MergeOptions): SAF<T>;

  /**
   * Convenience function to return all services of the merged features as a function.
   */
  createInstance(options?: MergeOptions): SF<T>;

  /**
   * @typeGenerator({ templates: ["create<{{K% extends keyof T}}>({{t%: K%}}, options?: MergeOptions): SAF<Pick<T, {{K% - | }}>>;\n"] })
   */

  create<K1 extends keyof T>(t1: K1, options?: MergeOptions): SAF<Pick<T, K1>>;

  create<K1 extends keyof T, K2 extends keyof T>(t1: K1, t2: K2, options?: MergeOptions): SAF<Pick<T, K1 | K2>>;

  create<K1 extends keyof T, K2 extends keyof T, K3 extends keyof T>(t1: K1, t2: K2, t3: K3, options?: MergeOptions): SAF<Pick<T, K1 | K2 | K3>>;

  create<K1 extends keyof T, K2 extends keyof T, K3 extends keyof T, K4 extends keyof T>(t1: K1, t2: K2, t3: K3, t4: K4, options?: MergeOptions): SAF<Pick<T, K1 | K2 | K3 | K4>>;

  create<K1 extends keyof T, K2 extends keyof T, K3 extends keyof T, K4 extends keyof T, K5 extends keyof T>(t1: K1, t2: K2, t3: K3, t4: K4, t5: K5, options?: MergeOptions): SAF<Pick<T, K1 | K2 | K3 | K4 | K5>>;

  create<K1 extends keyof T, K2 extends keyof T, K3 extends keyof T, K4 extends keyof T, K5 extends keyof T, K6 extends keyof T>(t1: K1, t2: K2, t3: K3, t4: K4, t5: K5, t6: K6, options?: MergeOptions): SAF<Pick<T, K1 | K2 | K3 | K4 | K5 | K6>>;

  create<K1 extends keyof T, K2 extends keyof T, K3 extends keyof T, K4 extends keyof T, K5 extends keyof T, K6 extends keyof T, K7 extends keyof T>(t1: K1, t2: K2, t3: K3, t4: K4, t5: K5, t6: K6, t7: K7, options?: MergeOptions): SAF<Pick<T, K1 | K2 | K3 | K4 | K5 | K6 | K7>>;

  create<K1 extends keyof T, K2 extends keyof T, K3 extends keyof T, K4 extends keyof T, K5 extends keyof T, K6 extends keyof T, K7 extends keyof T, K8 extends keyof T>(t1: K1, t2: K2, t3: K3, t4: K4, t5: K5, t6: K6, t7: K7, t8: K8, options?: MergeOptions): SAF<Pick<T, K1 | K2 | K3 | K4 | K5 | K6 | K7 | K8>>;

  create<K1 extends keyof T, K2 extends keyof T, K3 extends keyof T, K4 extends keyof T, K5 extends keyof T, K6 extends keyof T, K7 extends keyof T, K8 extends keyof T, K9 extends keyof T>(t1: K1, t2: K2, t3: K3, t4: K4, t5: K5, t6: K6, t7: K7, t8: K8, t9: K9, options?: MergeOptions): SAF<Pick<T, K1 | K2 | K3 | K4 | K5 | K6 | K7 | K8 | K9>>;

  create<K1 extends keyof T, K2 extends keyof T, K3 extends keyof T, K4 extends keyof T, K5 extends keyof T, K6 extends keyof T, K7 extends keyof T, K8 extends keyof T, K9 extends keyof T, K10 extends keyof T>(t1: K1, t2: K2, t3: K3, t4: K4, t5: K5, t6: K6, t7: K7, t8: K8, t9: K9, t10: K10, options?: MergeOptions): SAF<Pick<T, K1 | K2 | K3 | K4 | K5 | K6 | K7 | K8 | K9 | K10>>;

}
