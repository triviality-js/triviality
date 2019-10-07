import { FeatureFactoryComposeContext } from './FeatureFactoryComposeContext';
import { FeatureFactoryConstructContext } from './FeatureFactoryConstructContext';
import { FeatureFactoryOverrideContext } from './FeatureFactoryOverrideContext';
import { FeatureFactoryRegistryContext } from './FeatureFactoryRegistryContext';
import { FeatureFactoryServicesContext } from './FeatureFactoryServicesContext';

export { createFeatureFactoryContext } from './createFeatureFactoryContext';

export interface FeatureFactoryContext<T> extends FeatureFactoryRegistryContext<T>,
  FeatureFactoryComposeContext<T>,
  FeatureFactoryServicesContext<T>,
  FeatureFactoryConstructContext<T>,
  FeatureFactoryOverrideContext<T> {
}
