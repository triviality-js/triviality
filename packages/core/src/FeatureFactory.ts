import { FeatureFactoryContext } from './Context';
import { ServicesAsFactories } from './ServiceFactory';

export type FeatureFactory<OwnServices = {}, Dependencies = {}> =
  (services: FeatureFactoryContext<OwnServices & Dependencies> & ServicesAsFactories<Dependencies>) => ServicesAsFactories<OwnServices>;

export type FF<OwnServices = {}, Dependencies = {}> = FeatureFactory<OwnServices, Dependencies>;
