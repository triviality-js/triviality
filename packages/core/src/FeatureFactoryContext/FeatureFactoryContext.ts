import { createImmutableContainer, createMutableLockableContainer, MutableContainer } from '../Container';
import { fromPairs, includes, keys } from 'ramda';
import { createFeatureFactoryComposeContext, FeatureFactoryComposeContext } from './FeatureFactoryComposeContext';
import { createFeatureFactoryConstructContext, FeatureFactoryConstructContext } from './FeatureFactoryConstructContext';
import { createFeatureFactoryOverrideContext, FeatureFactoryOverrideContext } from './FeatureFactoryOverrideContext';
import { createFeatureFactoryRegistryContext, FeatureFactoryRegistryContext } from './FeatureFactoryRegistryContext';
import { createFeatureFactoryServicesContext, FeatureFactoryServicesContext } from './FeatureFactoryServicesContext';
import { createServiceFactoryReferenceContext, FeatureFactoryReferenceContext } from './FeatureFactoryReferenceContext';
import { ServiceTag } from '../ServiceFactory';

export interface FeatureFactoryContext<T> extends FeatureFactoryRegistryContext<T>,
  FeatureFactoryComposeContext<T>,
  FeatureFactoryServicesContext<T>,
  FeatureFactoryConstructContext<T>,
  FeatureFactoryOverrideContext<T>,
  FeatureFactoryReferenceContext {
}

export const createFeatureFactoryContext = <T>(container: MutableContainer): FeatureFactoryContext<T> & T => ({
  ...fromPairs(container.services()),
  ...createServiceFactoryReferenceContext(container),
  ...createFeatureFactoryOverrideContext(container),
  ...createFeatureFactoryComposeContext(container),
  ...createFeatureFactoryServicesContext(container),
  ...createFeatureFactoryConstructContext(container),
  ...createFeatureFactoryRegistryContext(container),
}) as any;

const FACTORY_CONTEXT_TAGS: string[] = keys(
  createFeatureFactoryContext(createMutableLockableContainer(createImmutableContainer()))) as any;

export const hasContextTag = (tag: ServiceTag) => includes(tag, FACTORY_CONTEXT_TAGS);
