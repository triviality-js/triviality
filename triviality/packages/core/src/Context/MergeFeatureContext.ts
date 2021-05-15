import {fromPairs, isObject, pick} from 'lodash';
import {
  FeatureFactory,
  ServicesAsFactories,
  ServicesAsFactories as SAF,
  SF,
  FF, FeatureGroupBuildInfo, UFF, assertFeatureFactoryWindow,
} from '../Value';
import {CompileContext} from "./CompileContext";
import {ContainerError} from "../Error";
import {GlobalInvokeStack} from "../GlobalInvokeStack";
import {MergeOptions, MergeWith} from "./MergeWith";
import {serviceInstances} from "../Util";
import type { KernelFeatureServices } from '../Feature';

export interface MergeFeatureContext<Services> {
  /**
   * Merging features inside other features.
   *
   *  - Option to pass services to the nested features
   *  - Option to pass services from the nested to the parent with feature, with the option to:
   *    - Register to any registry (if exposed)
   *    - Override to the service.
   *  - Option to allow multiple instances of the same feature.
   */
  merge<T>(featureFactory: FeatureFactory<T>): MergeWith<T>;

  /**
   * @typeGenerator({ templates: ["merge<{{K% extends keyof Services }}>({{k%:K%}}): MergeWith<Pick<Services, {{K% - | }}> & KernelFeatureServices>;\n"] })
   */

  merge<K1 extends keyof Services>(k1:K1): MergeWith<Pick<Services, K1>>;

  merge<K1 extends keyof Services, K2 extends keyof Services>(k1:K1, k2:K2): MergeWith<Pick<Services, K1 | K2>>;

  merge<K1 extends keyof Services, K2 extends keyof Services, K3 extends keyof Services>(k1:K1, k2:K2, k3:K3): MergeWith<Pick<Services, K1 | K2 | K3>>;

  merge<K1 extends keyof Services, K2 extends keyof Services, K3 extends keyof Services, K4 extends keyof Services>(k1:K1, k2:K2, k3:K3, k4:K4): MergeWith<Pick<Services, K1 | K2 | K3 | K4>>;

  merge<K1 extends keyof Services, K2 extends keyof Services, K3 extends keyof Services, K4 extends keyof Services, K5 extends keyof Services>(k1:K1, k2:K2, k3:K3, k4:K4, k5:K5): MergeWith<Pick<Services, K1 | K2 | K3 | K4 | K5>>;

  merge<K1 extends keyof Services, K2 extends keyof Services, K3 extends keyof Services, K4 extends keyof Services, K5 extends keyof Services, K6 extends keyof Services>(k1:K1, k2:K2, k3:K3, k4:K4, k5:K5, k6:K6): MergeWith<Pick<Services, K1 | K2 | K3 | K4 | K5 | K6>>;

  merge<K1 extends keyof Services, K2 extends keyof Services, K3 extends keyof Services, K4 extends keyof Services, K5 extends keyof Services, K6 extends keyof Services, K7 extends keyof Services>(k1:K1, k2:K2, k3:K3, k4:K4, k5:K5, k6:K6, k7:K7): MergeWith<Pick<Services, K1 | K2 | K3 | K4 | K5 | K6 | K7>>;

  merge<K1 extends keyof Services, K2 extends keyof Services, K3 extends keyof Services, K4 extends keyof Services, K5 extends keyof Services, K6 extends keyof Services, K7 extends keyof Services, K8 extends keyof Services>(k1:K1, k2:K2, k3:K3, k4:K4, k5:K5, k6:K6, k7:K7, k8:K8): MergeWith<Pick<Services, K1 | K2 | K3 | K4 | K5 | K6 | K7 | K8>>;

  merge<K1 extends keyof Services, K2 extends keyof Services, K3 extends keyof Services, K4 extends keyof Services, K5 extends keyof Services, K6 extends keyof Services, K7 extends keyof Services, K8 extends keyof Services, K9 extends keyof Services>(k1:K1, k2:K2, k3:K3, k4:K4, k5:K5, k6:K6, k7:K7, k8:K8, k9:K9): MergeWith<Pick<Services, K1 | K2 | K3 | K4 | K5 | K6 | K7 | K8 | K9>>;

  merge<K1 extends keyof Services, K2 extends keyof Services, K3 extends keyof Services, K4 extends keyof Services, K5 extends keyof Services, K6 extends keyof Services, K7 extends keyof Services, K8 extends keyof Services, K9 extends keyof Services, K10 extends keyof Services>(k1:K1, k2:K2, k3:K3, k4:K4, k5:K5, k6:K6, k7:K7, k8:K8, k9:K9, k10:K10): MergeWith<Pick<Services, K1 | K2 | K3 | K4 | K5 | K6 | K7 | K8 | K9 | K10>>;

}


export const createFeatureMergeContext = <T>(context: CompileContext<T>): MergeFeatureContext<T> => {
  return {
    merge: <S>( ...args: [FeatureFactory<S>] | (keyof T )[]): MergeWith<T | S> => {
      if (typeof args[0] === 'function') {
        const feature = args[0] as UFF;
        return createMergeWith(context, [feature]);
      }
      const keys = args as (keyof T )[];
      const features: UFF[] = [
        () => fromPairs(keys.map((key) => [key as string, context.getServiceFactory(key)])),
      ];
      return createMergeWith(context, features);
    },
  };
};

const createMergeWith = <T>(context: CompileContext<unknown>, features: UFF[]): MergeWith<T> => {
  const create = (...args: any[]): ServicesAsFactories<unknown> => {
    const keys: (keyof T)[] = args;
    let options: MergeOptions | undefined;
    const window = GlobalInvokeStack.getCurrent();
    if (isObject(args[args.length - 1])) {
      options = args.pop() as MergeOptions;
    } else {
      options = {
        name: window.serviceContainer.createPrivateFeatureGroupName(),
      };
    }
    assertFeatureFactoryWindow(window);
    const info = context.featureGroupFactory.build(features, options.name);
    window.featureFactory.addContainer(info);
    if (args.length === 0) {
      return info.references;
    }
    return pick(info.references, keys);
  };
  return {
    with<ExtendWith>(featureFactory: FeatureFactory<ExtendWith, T>): MergeWith<T & ExtendWith> {
      return createMergeWith<T & ExtendWith>(context, [...features, featureFactory as UFF]);
    },
    createInstance: (options?: MergeOptions) => {
      const services = options ? create(options) : create();
      return () => serviceInstances(services);
    },
    create,
  } as MergeWith<T>;
}
