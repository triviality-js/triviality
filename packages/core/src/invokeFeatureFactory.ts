import { forEach, toPairs } from 'ramda';
import { MutableContainer, setNewServiceToContainer, setServices } from './Container';
import { FF } from './FeatureFactory';
import { createFeatureFactoryContext, hasContextTag, withGlobalContext, postFeatureFactoryContext } from './Context';
import { ServiceTag, SF } from './ServiceFactory';

export function invokeFeatureFactory<S, D, C extends MutableContainer>(container: C, sf: FF<S, D>): void;
export function invokeFeatureFactory<S, D, C extends MutableContainer>(container: C): (sf: FF<S, D>) => void;
export function invokeFeatureFactory<S, D, C extends MutableContainer>(container: C, sf?: FF<S, D>): ((sf: FF<S, D>) => void) | void {
  if (!sf) {
    return (sfc) => invokeFeatureFactory(container, sfc);
  }
  const setNewService = setNewServiceToContainer(container);
  const factoryContext = createFeatureFactoryContext<S, D>(container, invokeFeatureFactory);

  withGlobalContext(factoryContext, () => {
    const newServices: [[ServiceTag, SF]] = toPairs(sf(factoryContext) as any) as any;
    newServices.forEach(([tag]) => {
      if (hasContextTag(tag)) {
        throw new Error(`Cannot use "${tag}" context name for service factories`);
      }
      if (container.hasService(tag)) {
        throw new Error(`Cannot redefine "${tag}" service`);
      }
    });
    postFeatureFactoryContext(newServices,  container);
    setServices(setNewService)(newServices);
  });
}

export const invokeFeatureFactories: <T extends MutableContainer>(container: T) => (features: Array<FF<any, any>>) => void =
  <T extends MutableContainer>(container: T) => forEach<FF>(invokeFeatureFactory(container));
