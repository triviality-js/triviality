import {FeatureFactoryBuildInfo} from "./BuildInfo";
import {ServiceFactoryOverride} from "../Context/OverrideContext";

export interface OverrideInformation<T> {
  /**
   * Successfully overridden the service.
   *
   * The override function can be run multiple times because of async errors, but the ServiceFactoryReference preserves the successful overrides.
   * Next retries only retry failed overrides.
   */
  success: boolean;
  /**
   * Keep track of the overridden services. (Only if invoked)
   */
  original?: T;
  featureFactory: FeatureFactoryBuildInfo;
  overrideBy: ServiceFactoryOverride<T>;
}
