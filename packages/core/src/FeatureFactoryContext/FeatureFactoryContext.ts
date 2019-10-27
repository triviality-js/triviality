import { MutableContainer } from '../container';
import { fromPairs } from 'ramda';
import { createFeatureFactoryComposeContext, FeatureFactoryComposeContext } from './FeatureFactoryComposeContext';
import { createFeatureFactoryConstructContext, FeatureFactoryConstructContext } from './FeatureFactoryConstructContext';
import { createFeatureFactoryOverrideContext, FeatureFactoryOverrideContext } from './FeatureFactoryOverrideContext';
import { createFeatureFactoryRegistryContext, FeatureFactoryRegistryContext } from './FeatureFactoryRegistryContext';
import { createFeatureFactoryServicesContext, FeatureFactoryServicesContext } from './FeatureFactoryServicesContext';

export interface FeatureFactoryContext<T> extends FeatureFactoryRegistryContext<T>,
  FeatureFactoryComposeContext<T>,
  FeatureFactoryServicesContext<T>,
  FeatureFactoryConstructContext<T>,
  FeatureFactoryOverrideContext<T> {
}

export const createFeatureFactoryContext = <T>(container: MutableContainer): FeatureFactoryContext<T> & T => ({
  ...fromPairs(container.services()),
  ...createFeatureFactoryOverrideContext(container),
  ...createFeatureFactoryComposeContext(container),
  ...createFeatureFactoryServicesContext(container),
  ...createFeatureFactoryConstructContext(container),
  ...createFeatureFactoryRegistryContext(container),
}) as any;
