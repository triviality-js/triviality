import { ContainerFactory } from './ContainerFactory';

export * from './FeatureFactory';
export * from './ServiceFactory';
export * from './FeatureFactoryContext';
export * from './ContainerFactory';

export const triviality = ContainerFactory.create;
export default triviality;
