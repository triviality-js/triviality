import {FF, FeatureGroupBuildInfo, UFF} from "./Value";

export interface FeatureGroupFactoryInterface {
  build<S>(featureFactories: UFF[], name: string): FeatureGroupBuildInfo<S>;
}
