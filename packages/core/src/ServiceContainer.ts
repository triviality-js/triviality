import { Registries } from './FeatureFactoryContext/FeatureFactoryRegistryContext';

export type ServiceContainer<S> = S & { registries: () => Registries<S> } ;
