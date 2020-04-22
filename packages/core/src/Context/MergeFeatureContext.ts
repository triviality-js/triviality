import { ServicesAsFactories as SAF, ServiceTag, SF } from '../ServiceFactory';
import { FeatureFactory, FF } from '../FeatureFactory';
import { ServiceFunctionReferenceContainerInterface } from '../Containerd/ServiceFunctionReferenceContainerInterface';
import { services, servicesByTags } from './ServicesContext';
import { MergeServiceFunctionReferenceContainer } from '../Containerd/MergeServiceFunctionReferenceContainer';
import { InternalContextContext } from './InternalContextContext';
import { fromPairs } from 'ramda';
import { defaultServiceKeys, DefaultServices } from '../Feature/defaultServicesKeys';

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
  merge<T>(featureFactory: FeatureFactory<T, DefaultServices>): MergeWith<DefaultServices & T>;

  /**
   * @typeGenerator({ templates: ["  merge<{{K% extends keyof Services }}>({{k%:K%}}): MergeWith<DefaultServices & Pick<Services, {{K% - | }}>>;\n"] })
   */
  merge<K1 extends keyof Services>(k1:K1): MergeWith<DefaultServices & Pick<Services, K1>>;

  merge<K1 extends keyof Services, K2 extends keyof Services>(k1:K1, k2:K2): MergeWith<DefaultServices & Pick<Services, K1 | K2>>;

  merge<K1 extends keyof Services, K2 extends keyof Services, K3 extends keyof Services>(k1:K1, k2:K2, k3:K3): MergeWith<DefaultServices & Pick<Services, K1 | K2 | K3>>;

  merge<K1 extends keyof Services, K2 extends keyof Services, K3 extends keyof Services, K4 extends keyof Services>(k1:K1, k2:K2, k3:K3, k4:K4): MergeWith<DefaultServices & Pick<Services, K1 | K2 | K3 | K4>>;

  merge<K1 extends keyof Services, K2 extends keyof Services, K3 extends keyof Services, K4 extends keyof Services, K5 extends keyof Services>(k1:K1, k2:K2, k3:K3, k4:K4, k5:K5): MergeWith<DefaultServices & Pick<Services, K1 | K2 | K3 | K4 | K5>>;

  merge<K1 extends keyof Services, K2 extends keyof Services, K3 extends keyof Services, K4 extends keyof Services, K5 extends keyof Services, K6 extends keyof Services>(k1:K1, k2:K2, k3:K3, k4:K4, k5:K5, k6:K6): MergeWith<DefaultServices & Pick<Services, K1 | K2 | K3 | K4 | K5 | K6>>;

  merge<K1 extends keyof Services, K2 extends keyof Services, K3 extends keyof Services, K4 extends keyof Services, K5 extends keyof Services, K6 extends keyof Services, K7 extends keyof Services>(k1:K1, k2:K2, k3:K3, k4:K4, k5:K5, k6:K6, k7:K7): MergeWith<DefaultServices & Pick<Services, K1 | K2 | K3 | K4 | K5 | K6 | K7>>;

  merge<K1 extends keyof Services, K2 extends keyof Services, K3 extends keyof Services, K4 extends keyof Services, K5 extends keyof Services, K6 extends keyof Services, K7 extends keyof Services, K8 extends keyof Services>(k1:K1, k2:K2, k3:K3, k4:K4, k5:K5, k6:K6, k7:K7, k8:K8): MergeWith<DefaultServices & Pick<Services, K1 | K2 | K3 | K4 | K5 | K6 | K7 | K8>>;

  merge<K1 extends keyof Services, K2 extends keyof Services, K3 extends keyof Services, K4 extends keyof Services, K5 extends keyof Services, K6 extends keyof Services, K7 extends keyof Services, K8 extends keyof Services, K9 extends keyof Services>(k1:K1, k2:K2, k3:K3, k4:K4, k5:K5, k6:K6, k7:K7, k8:K8, k9:K9): MergeWith<DefaultServices & Pick<Services, K1 | K2 | K3 | K4 | K5 | K6 | K7 | K8 | K9>>;

  merge<K1 extends keyof Services, K2 extends keyof Services, K3 extends keyof Services, K4 extends keyof Services, K5 extends keyof Services, K6 extends keyof Services, K7 extends keyof Services, K8 extends keyof Services, K9 extends keyof Services, K10 extends keyof Services>(k1:K1, k2:K2, k3:K3, k4:K4, k5:K5, k6:K6, k7:K7, k8:K8, k9:K9, k10:K10): MergeWith<DefaultServices & Pick<Services, K1 | K2 | K3 | K4 | K5 | K6 | K7 | K8 | K9 | K10>>;

}

/**
 *
 */
export interface MergeWith<T> {
  with<ExtendWith>(featureFactory: FeatureFactory<ExtendWith, T>): MergeWith<T & ExtendWith>;

  /**
   * Return all new services.
   *
   * TODO: fix return type?, does not returned parent services, Maybe it can return those, and ignore them?
   */
  all(): SAF<T>;

  service<K1 extends keyof T>(t1: K1): SF<T[K1]>;

  /**
   * @typeGenerator({ templates: ["  services<{{K% extends keyof T}}>({{t%: K%}}): SAF<Pick<T, {{K% - | }}>> & [{{SF<T[K%]>}}];\n"] })
   */
  services<K1 extends keyof T>(t1: K1): SAF<Pick<T, K1>> & [SF<T[K1]>];

  services<K1 extends keyof T, K2 extends keyof T>(t1: K1, t2: K2): SAF<Pick<T, K1 | K2>> & [SF<T[K1]>, SF<T[K2]>];

  services<K1 extends keyof T, K2 extends keyof T, K3 extends keyof T>(t1: K1, t2: K2, t3: K3): SAF<Pick<T, K1 | K2 | K3>> & [SF<T[K1]>, SF<T[K2]>, SF<T[K3]>];

  services<K1 extends keyof T, K2 extends keyof T, K3 extends keyof T, K4 extends keyof T>(t1: K1, t2: K2, t3: K3, t4: K4): SAF<Pick<T, K1 | K2 | K3 | K4>> & [SF<T[K1]>, SF<T[K2]>, SF<T[K3]>, SF<T[K4]>];

  services<K1 extends keyof T, K2 extends keyof T, K3 extends keyof T, K4 extends keyof T, K5 extends keyof T>(t1: K1, t2: K2, t3: K3, t4: K4, t5: K5): SAF<Pick<T, K1 | K2 | K3 | K4 | K5>> & [SF<T[K1]>, SF<T[K2]>, SF<T[K3]>, SF<T[K4]>, SF<T[K5]>];

  services<K1 extends keyof T, K2 extends keyof T, K3 extends keyof T, K4 extends keyof T, K5 extends keyof T, K6 extends keyof T>(t1: K1, t2: K2, t3: K3, t4: K4, t5: K5, t6: K6): SAF<Pick<T, K1 | K2 | K3 | K4 | K5 | K6>> & [SF<T[K1]>, SF<T[K2]>, SF<T[K3]>, SF<T[K4]>, SF<T[K5]>, SF<T[K6]>];

  services<K1 extends keyof T, K2 extends keyof T, K3 extends keyof T, K4 extends keyof T, K5 extends keyof T, K6 extends keyof T, K7 extends keyof T>(t1: K1, t2: K2, t3: K3, t4: K4, t5: K5, t6: K6, t7: K7): SAF<Pick<T, K1 | K2 | K3 | K4 | K5 | K6 | K7>> & [SF<T[K1]>, SF<T[K2]>, SF<T[K3]>, SF<T[K4]>, SF<T[K5]>, SF<T[K6]>, SF<T[K7]>];

  services<K1 extends keyof T, K2 extends keyof T, K3 extends keyof T, K4 extends keyof T, K5 extends keyof T, K6 extends keyof T, K7 extends keyof T, K8 extends keyof T>(t1: K1, t2: K2, t3: K3, t4: K4, t5: K5, t6: K6, t7: K7, t8: K8): SAF<Pick<T, K1 | K2 | K3 | K4 | K5 | K6 | K7 | K8>> & [SF<T[K1]>, SF<T[K2]>, SF<T[K3]>, SF<T[K4]>, SF<T[K5]>, SF<T[K6]>, SF<T[K7]>, SF<T[K8]>];

  services<K1 extends keyof T, K2 extends keyof T, K3 extends keyof T, K4 extends keyof T, K5 extends keyof T, K6 extends keyof T, K7 extends keyof T, K8 extends keyof T, K9 extends keyof T>(t1: K1, t2: K2, t3: K3, t4: K4, t5: K5, t6: K6, t7: K7, t8: K8, t9: K9): SAF<Pick<T, K1 | K2 | K3 | K4 | K5 | K6 | K7 | K8 | K9>> & [SF<T[K1]>, SF<T[K2]>, SF<T[K3]>, SF<T[K4]>, SF<T[K5]>, SF<T[K6]>, SF<T[K7]>, SF<T[K8]>, SF<T[K9]>];

  services<K1 extends keyof T, K2 extends keyof T, K3 extends keyof T, K4 extends keyof T, K5 extends keyof T, K6 extends keyof T, K7 extends keyof T, K8 extends keyof T, K9 extends keyof T, K10 extends keyof T>(t1: K1, t2: K2, t3: K3, t4: K4, t5: K5, t6: K6, t7: K7, t8: K8, t9: K9, t10: K10): SAF<Pick<T, K1 | K2 | K3 | K4 | K5 | K6 | K7 | K8 | K9 | K10>> & [SF<T[K1]>, SF<T[K2]>, SF<T[K3]>, SF<T[K4]>, SF<T[K5]>, SF<T[K6]>, SF<T[K7]>, SF<T[K8]>, SF<T[K9]>, SF<T[K10]>];

}

export const createFeatureMergeContext = (context: InternalContextContext): MergeFeatureContext<any> => ({
  merge: mergeFeature(context) as any,
});

export const mergeFeature = <Services>({ container, invoke }: InternalContextContext) => {
  const mergeWith = (previousContainer: ServiceFunctionReferenceContainerInterface) => <S, Dependencies>(sf: FF<S, Services> | ServiceTag[]): MergeWith<Services | Dependencies> => {
    const current = new MergeServiceFunctionReferenceContainer(container);
    // Add all dependencies of the previous container.
    previousContainer.references().forEach((dependency) => {
      current.addMerged(dependency);
    });
    if (sf instanceof Array) {
      sf.forEach((key) => {
        current.addMerged(container.references().getService(key));
      });
    } else {
      invoke({ container: current, invoke }, sf as any);
    }
    return {
      service: current.getService,
      services: services((...tags: ServiceTag[]) => servicesByTags(current.getService)(...(tags as [ServiceTag]))) as any,
      all: () => {
        return fromPairs(current.references().taggedPairs().filter(([tag]) => {
          return !container.references().hasTagged(tag);
        }).map(([tag]) => {
          return [tag, current.getService(tag)];
        })) as any;
      },
      with: mergeWith(current) as any,
    };
  };
  const defaultServices = new MergeServiceFunctionReferenceContainer(container);
  defaultServiceKeys.forEach((key) => {
    // The default feature factories also use this context, but not all services are yet defined.
    if (!container.references().hasTagged(key)) {
      return;
    }
    defaultServices.addMerged(container.references().getService(key));
  });
  return mergeWith(defaultServices);
};
