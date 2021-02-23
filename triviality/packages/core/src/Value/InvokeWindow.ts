import {FeatureFactoryBuildInfo, FeatureGroupBuildInfo, ServiceFactoryInfo} from "./BuildInfo";

export interface ContainerInvokeWindow<T> {
  readonly serviceContainer: FeatureGroupBuildInfo<T>;
}

export interface FeatureInvokeWindow<T> extends ContainerInvokeWindow<T> {
  readonly featureFactory: FeatureFactoryBuildInfo;
}

export interface ServiceFactoryInvokeWindow<T> extends FeatureInvokeWindow<T> {
  readonly serviceFactory: ServiceFactoryInfo;
}

export const isFeatureFactoryInvokeWindow = (window: InvokeWindow): window is FeatureInvokeWindow<unknown> => {
  return 'featureFactory' in window;
}

export const isServiceFactoryInvokeWindow = (window: InvokeWindow): window is ServiceFactoryInvokeWindow<unknown> => {
  return 'serviceFactory' in window;
}

export type InvokeWindow<T = unknown> = ContainerInvokeWindow<T> | FeatureInvokeWindow<T> | ServiceFactoryInvokeWindow<T>;
