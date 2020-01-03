import { forEach, toPairs } from 'ramda';
import { FF } from './FeatureFactory';
import {
  createFeatureFactoryContext,
  handleServiceReferenced,
  hasContextTag,
  isServiceReferenced,
  withGlobalContext,
} from './Context';
import { ServiceTag, SF } from './ServiceFactory';
import { TaggedServiceFactoryReference } from './Value/TaggedServiceFactoryReference';
import { InternalContextContext } from './Context/InternalContextContext';

type ExcludeInvokeInternalContext = Omit<InternalContextContext, 'invoke'> & { invoke?: typeof invokeFeatureFactory};

export function invokeFeatureFactory(context: ExcludeInvokeInternalContext, ff: FF): void;
export function invokeFeatureFactory(context: ExcludeInvokeInternalContext): (ff: FF) => void;
export function invokeFeatureFactory(internalContext: ExcludeInvokeInternalContext, ff?: FF): ((ff: FF) => void) | void {
  if (!ff) {
    return (ffc) => invokeFeatureFactory(internalContext, ffc);
  }
  const { container } = internalContext;
  const context = createFeatureFactoryContext({ invoke: invokeFeatureFactory, ...internalContext });
  withGlobalContext({ context, container, featureFactory: ff }, () => {
    const newServices: [ServiceTag, SF][] = toPairs(ff(context) as any) as any;
    newServices.forEach(([tag, factory]) => {
      if (hasContextTag(tag)) {
        throw new Error(`Cannot use "${tag}" context name for service factories`);
      }
      if (container.references().hasTagged(tag)) {
        throw new Error(`Cannot redefine "${tag}" service`);
      }
      if (isServiceReferenced(factory)) {
        handleServiceReferenced(container, factory, tag);
        return;
      }
      container.add(new TaggedServiceFactoryReference({
        tag,
        factory,
        feature: ff,
      }));
    });
  });
}

export const invokeFeatureFactories: (context: ExcludeInvokeInternalContext) => (features: FF<any, any>[]) => void = (context) => forEach<FF>(
  invokeFeatureFactory(context));
