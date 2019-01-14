import { ContainerFactory } from './ContainerFactory';

export * from './Container';
export * from './ContainerFactory';
export * from './Feature';
export * from './Registries';
export * from './deprecated';
export * from './ContainerError';
export * from './util/Types';

export * from './value/Registry';
export * from './value/Service';
export * from './value/FeatureTypes';

export function triviality(): ContainerFactory<{}, {}> {
  return ContainerFactory.create();
}

export default triviality;
