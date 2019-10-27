import { ContainerFactory } from './ContainerFactory';

export * from './FeatureFactory';
export * from './ContainerFactory';

export const triviality = <T>() => new ContainerFactory<T>();

export default triviality;
