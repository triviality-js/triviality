import { ContainerFactory } from './ContainerFactory';

export * from './FeatureFactory';
export * from './ContainerFactory';
export * from './Error/ContainerError';

export const triviality = <T>() => new ContainerFactory<T>();

export default triviality;
