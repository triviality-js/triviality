import { ContainerFactory } from './ContainerFactory';

export * from './util/Types';
export * from './ContainerFactory';
export * from './Error/ContainerError';

export * from './BuildStep/BuildStep';
export * from './BuildStep/BuildChain';
export * from './BuildStep/MergeRegistries';
export * from './BuildStep/OverrideServices';
export * from './BuildStep/RegisterFeatureServices';
export * from './BuildStep/SetupFeatures';

export * from './Type/Container';
export * from './Type/Feature';
export * from './Type/Registries';
export * from './Type/deprecated';
export * from './Type/Registry';
export * from './Type/Service';
export * from './Type/FeatureTypes';

export function triviality(): ContainerFactory<{}, {}> {
  return ContainerFactory.create();
}

export default triviality;
