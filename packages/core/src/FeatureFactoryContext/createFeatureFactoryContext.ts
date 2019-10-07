import { mapObjIndexed } from 'ramda';
import { createLockableContainer, LockableContainer } from '../container';
import { FF } from '../FeatureFactory';
import { SF } from '../ServiceFactory';
import { composeServiceByTags } from './FeatureFactoryComposeContext';
import { constructServiceByTags } from './FeatureFactoryConstructContext';
import { overrideService } from './FeatureFactoryOverrideContext';
import { registerList } from './FeatureFactoryRegistryContext/registerList';
import { registerMap } from './FeatureFactoryRegistryContext/registerMap';
import { servicesByTags } from './FeatureFactoryServicesContext';
import { FeatureFactoryContext } from './index';

export function createFeatureFactoryContext<S, D>(sf: FF<S, D>, dependencies: D & { container?: SF<LockableContainer> }): S;
export function createFeatureFactoryContext<S, D>(sf: FF<S, D>): (dependencies: D & { container?: SF<LockableContainer> }) => S;
export function createFeatureFactoryContext<S, D>(sf: FF<S, D>, dependencies?: D & { container?: SF<LockableContainer> }): ((dependencies: D & { container?: SF<LockableContainer> }) => S) | S {
  if (!dependencies) {
    return (d) => createFeatureFactoryContext(sf, d);
  }
  /**
   * Setter injection for the container.
   */
  const getContainerReference = (): LockableContainer => {
    const container = dependencies.container;
    if (!container) {
      const lockableContainer = createLockableContainer();
      lockableContainer.setNewServices(dependencies as any);
      lockableContainer.setNewServices(instance as any);
      lockableContainer.lock();
      return lockableContainer;
    }
    return container().setNewServices(instance as any);
  };
  const serviceRegistry: any = (tag: string) => () => getContainerReference().getUpdatedServiceReference(tag)();
  const cf: FeatureFactoryContext<D & S> = {
    ...mapObjIndexed((_func: unknown, key) => serviceRegistry(key), dependencies),
    services: servicesByTags(serviceRegistry) as any,
    compose: composeServiceByTags(serviceRegistry),
    construct: constructServiceByTags(serviceRegistry),
    registerList,
    registerMap,
    override: overrideService(getContainerReference) as any,
    overrideWith: null as any,
    composeOverride: null as any,
    constructOverride: null as any,
    registries: null as any,
  };
  const instance = sf(cf as any);


  return instance;
}
