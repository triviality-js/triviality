import { forEach, includes, keys, toPairs } from 'ramda';
import { createMutableLockableContainer, MutableContainer, setNewServices, setServices } from './container';
import { FF } from './FeatureFactory';
import { createFeatureFactoryContext } from './FeatureFactoryContext';
import { ServiceTag, SF } from './ServiceFactory';

const FACTORY_CONTEXT_TAGS: string[] = keys(createFeatureFactoryContext(createMutableLockableContainer())) as any;
const hasContextTag = (tag: ServiceTag) => includes(tag, FACTORY_CONTEXT_TAGS);

export function invokeFeatureFactory<S, D, C extends MutableContainer>(container: C, sf: FF<S, D>): void;
export function invokeFeatureFactory<S, D, C extends MutableContainer>(container: C): (sf: FF<S, D>) => void;
export function invokeFeatureFactory<S, D, C extends MutableContainer>(container: C, sf?: FF<S, D>): ((sf: FF<S, D>) => void) | void {
  if (!sf) {
    return (sfc) => invokeFeatureFactory(container, sfc);
  }
  const setNewService = setNewServices(container);
  const factoryContext = createFeatureFactoryContext<D & S>(container);
  const newServices: [[ServiceTag, SF]] = toPairs(sf(factoryContext) as any) as any;
  newServices.forEach(([tag]) => {
    if (hasContextTag(tag)) {
      throw new Error(`Cannot use "${tag}" context name for service factories.`);
    }
  });
  setServices(setNewService)(newServices);
}

export const invokeFeatureFactories: <T extends MutableContainer>(container: T) => (features: Array<FF<any, any>>) => void =
  <T extends MutableContainer>(container: T) =>
    forEach<FF<any, any>>(
      (fs) => invokeFeatureFactory(container, fs),
    );
