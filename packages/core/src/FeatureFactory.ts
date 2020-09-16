import { ServicesAsFactories } from './ServiceFactory';

export type FeatureFactory<TServices = {}, TDependencies = {}> = ((services: TDependencies) => ServicesAsFactories<TServices>);
export type FF<TServices = {}, TDependencies = {}> = FeatureFactory<TServices, TDependencies>;
