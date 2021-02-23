import {
  FeatureGroupBuildInfo,
  FeatureFactoryBuildInfo,
  ServiceFactoryReference,
  ServiceFactoryReferences,
  SF,
  SFR, FF, USF, UFF, GetServiceFactory, UFC
} from './Value';
import {CompileContext, createFeatureFactoryContext} from "./Context";
import {ContainerError, retryUntilNoAsyncErrors} from "./Error";
import {toPairs} from "lodash";
import {asServiceFactoryReference} from "./serviceReferenceFactoryInterface";
import {
  createPendingServiceFactoryReference,
  PendingServiceFactoryReference
} from "./createPendingServiceFactoryReference";
import {GlobalInvokeStack} from "./GlobalInvokeStack";
import {FeatureGroupFactoryInterface} from "./FeatureGroupFactoryInterface";

/**
 * Immutable container factory.
 */
export class FeatureGroupFactory implements FeatureGroupFactoryInterface {

  public build<S>(featureFactories: UFF[], name: string): FeatureGroupBuildInfo<S> {
    const info = new FeatureGroupBuildInfo<S>(name, this);
    const {featureContext, references} = info;
    /**
     * Set all feature function to the container object.
     */
    for (const feature of featureFactories) {
      const featureFactory = new FeatureFactoryBuildInfo(feature);
      info.addFeature(featureFactory);
      GlobalInvokeStack.run<S>({featureFactory, serviceContainer: info},  () => {
        /**
         * We bind the feature so the internal reference correct
         */
        const result = feature.bind(references)(featureContext as UFC) as Record<string, USF>;
        for (const [name, service] of toPairs(result)) {
          if (name in references) {
            throw new ContainerError(`Service with ${name} already registered`);
          }
          const sfr = asServiceFactoryReference(service.bind(references));
          Object.assign(references, {
            [name]: sfr
          });
          featureFactory.addService(sfr.info);
          /**
           * We rebind function call to allow closures inside the feature.
           */
          result[name] = info.getServiceFactory(name as keyof S);
        }
      });
    }

    info.resolvePendingReferences();

    return info;
  }
}
