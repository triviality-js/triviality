import { InferRegistries } from './FeatureFactoryContext/FeatureFactoryRegistryContext';

export type ServiceContainer<S> = S & { registries: () => InferRegistries<S> } ;
