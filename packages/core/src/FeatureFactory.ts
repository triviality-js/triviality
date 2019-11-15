import { FeatureFactoryContext } from './Context';
import { ServicesAsFactories } from './ServiceFactory';

export type FeatureFactory<OwnServices = unknown, Dependencies = unknown> =
  (services: FeatureFactoryContext<OwnServices & Dependencies> & ServicesAsFactories<Dependencies>) => ServicesAsFactories<OwnServices>;

export type FF<OwnServices = unknown, Dependencies = unknown> = FeatureFactory<OwnServices, Dependencies>;
