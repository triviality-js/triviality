import { ContainerFactory } from './ContainerFactory';

export * from './Containerd';
export * from './Context';
export * from './FeatureFactory';
export * from './ServiceFactory';
export * from './Feature';
export * from './testing';
export * from './ContainerFactory';

export const triviality = ContainerFactory.create;
export default triviality;
