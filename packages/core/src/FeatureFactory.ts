import { FeatureFactoryContext } from './Context/FeatureFactoryContext';
import { ServicesAsFactories } from './ServiceFactory';

export type FeatureFactory<OwnServices = {}, Dependencies = {}> =
  ((services: FeatureFactoryContext<OwnServices & Dependencies> & ServicesAsFactories<Dependencies>) => ServicesAsFactories<OwnServices>);

export type FeatureContext<OwnServices = {}, Dependencies = {}> = FeatureFactoryContext<OwnServices & Dependencies> & ServicesAsFactories<Dependencies>;

export type FF<OwnServices = {}, Dependencies = {}> = FeatureFactory<OwnServices, Dependencies>;
