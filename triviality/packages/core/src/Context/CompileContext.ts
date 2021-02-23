import type {FeatureGroupBuildInfo, GetServiceFactory, ServicesAsFactories} from '../Value';
import {FeatureGroupFactoryInterface} from "../FeatureGroupFactoryInterface";
import {ServiceReferenceFactoryInterface} from "../serviceReferenceFactoryInterface";

export interface CompileContext<T> {
  readonly getServices: () => ServicesAsFactories<T>;
  readonly getServiceFactory: GetServiceFactory<T>;
  readonly serviceReferenceFactory: ServiceReferenceFactoryInterface;
  readonly featureGroupFactory: FeatureGroupFactoryInterface;
}
