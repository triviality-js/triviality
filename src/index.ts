import { ContainerFactory } from './ContainerFactory';

export * from './Container';
export * from './ContainerFactory';
export * from './Module';
export * from './ContainerError';
export * from './util/Types';

export function triviality(): ContainerFactory<{}, {}> {
  return ContainerFactory.create();
}

export default triviality;
