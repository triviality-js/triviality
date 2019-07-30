import { ContainerFactory } from './ContainerFactory';
import { FeatureInstance, ServiceContainer } from './types';

export * from './util/Types';
export * from './ContainerFactory';
export * from './Error/ContainerError';

export const triviality = () => ({
  add: <S>(feature: (container: ServiceContainer<S>) => FeatureInstance<S>): ContainerFactory<S> => {
    const factory = new ContainerFactory<S>();
    return factory.add(feature as any);
  },
});

export default triviality;
