import { ContainerFactory } from './ContainerFactory';

export * from './Container';
export * from './ContainerFactory';
export * from './Feature';
export * from './deprecated';
export * from './ContainerError';
export * from './util/Types';

export function triviality(): ContainerFactory<{}, {}> {
  return ContainerFactory.create();
}

export default triviality;
