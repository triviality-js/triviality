import { FeatureFactoryContext } from './FeatureFactoryContext';

export type FeatureInstance<Services = unknown> = Services;

export type FeatureFactory<OwnServices = {}, Dependencies = {}> =
  (services: Dependencies & FeatureFactoryContext<Dependencies & OwnServices>) => FeatureInstance<OwnServices>;
export type FF<OwnServices = unknown, Dependencies = unknown> = FeatureFactory<OwnServices, Dependencies>;
