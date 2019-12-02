import { ServicesAsFactories, ServiceTag, SF } from '../ServiceFactory';
import { FeatureFactory, FF } from '../FeatureFactory';
import { MutableContainer, serviceNames } from '../Container';
import { difference, fromPairs } from 'ramda';
import { invokeFeatureFactory } from '../invokeFeatureFactory';

export interface MergeFeatureContext<Services> {
  merge<T>(featureFactory: FeatureFactory<T, Services>): MergeWith<Services & T, T>;
}

/**
 * 'Combine' is the actual result when combined, not initial dependencies.
 */
export interface MergeWith<Dependencies, Combined> {
  with<T>(featureFactory: FeatureFactory<T, Dependencies>): MergeWith<Dependencies & T, Combined & T>;

  services(): ServicesAsFactories<Combined>;
}

export const createFeatureMergeContext = (container: MutableContainer, invoke: typeof invokeFeatureFactory): MergeFeatureContext<any> => ({
  merge: mergeFeature(container, invoke),
});

export const mergeFeature = <Services>(container: MutableContainer, invoke: typeof invokeFeatureFactory) => {
  const mergeWith = (names?: string[]) => <S, Dependencies>(sf: FF<S, Services>): MergeWith<Services | Dependencies, S> => {
    const namesBefore = names || serviceNames(container);
    invoke(container)(sf as any);
    return {
      services: (): ServicesAsFactories<S> => {
        const namesAfter = serviceNames(container);
        const added = difference(namesAfter, namesBefore);
        const serviceReferences: Array<[ServiceTag, SF]> = added.map((serviceName) => [serviceName, container.getService(serviceName)]);
        return fromPairs(serviceReferences) as any;
      },
      with: mergeWith(namesBefore) as any,
    };
  };
  return mergeWith();
};
