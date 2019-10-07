import { FeatureFactoryContext } from './FeatureFactoryContext';

export type FeatureInstance<Services = unknown> = Services;

export type FeatureFactory<OwnServices = {}, ContainerServices = {}> =
  (services: ContainerServices & FeatureFactoryContext<ContainerServices & OwnServices>) => FeatureInstance<OwnServices>;
export type FF<OwnServices, ContainerServices = unknown> = FeatureFactory<OwnServices, ContainerServices>;
