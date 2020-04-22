import { InternalContextContext } from './InternalContextContext';
import { ServicesAsFactories, ServiceTag } from '../ServiceFactory';
import { createServiceFactoryReferenceContext } from './ReferenceContext';
import { createFeatureFactoryOverrideContext } from './OverrideContext';
import { createFeatureFactoryComposeContext } from './ComposeContext';
import { createFeatureFactoryServicesContext } from './ServicesContext';
import { createFeatureFactoryConstructContext } from './ConstructContext';
import { createFeatureFactoryRegistryContext } from './RegistryContext';
import { createFeatureMergeContext } from './MergeFeatureContext';
import { ServiceFunctionReferenceContainer } from '../Container';
import { FeatureFactoryContext } from './FeatureFactoryContext';
import { keys, includes } from 'ramda';
import { createFeatureFactoryAsyncContext } from './AsyncContext';

export const createFeatureFactoryContext = <OwnServices, Dependencies>(context: InternalContextContext):
  FeatureFactoryContext<OwnServices & Dependencies> & ServicesAsFactories<Dependencies> => {
  const { container } = context;
  return ({
    ...container.references().serviceFactoryObject(),
    ...createServiceFactoryReferenceContext(),
    ...createFeatureFactoryOverrideContext(container),
    ...createFeatureFactoryComposeContext(container),
    ...createFeatureFactoryServicesContext(container),
    ...createFeatureFactoryConstructContext(container),
    ...createFeatureFactoryRegistryContext(container),
    ...createFeatureMergeContext(context),
    ...createFeatureFactoryAsyncContext(context),
  }) as any;
};

const FACTORY_CONTEXT_TAGS: string[] = keys(
  createFeatureFactoryContext(
    { container: new ServiceFunctionReferenceContainer(), invoke: () => void 0 } as any)) as string[];

export const hasContextTag = (tag: ServiceTag) => includes(tag, FACTORY_CONTEXT_TAGS);
