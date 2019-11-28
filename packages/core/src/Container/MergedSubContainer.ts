import { ServiceTag, SF } from '../ServiceFactory';
import { MutableContainer } from './MutableContainer';
import { createMutableLockableContainer, MutableLockableContainer } from './MutableLockableContainer';

export interface MergedSubContainer extends MutableLockableContainer {
  subServices(): Array<[ServiceTag, SF]>;
}

/**
 *  Create a container that define services, services defined defined keep private for parent container.
 *
 * TODO: rename, NestedServicesContainer, ChildServiceContainer?.
 *
 * - Assign services to container.
 * - mainContainer as first choice of fetching services.
 * - Can't have duplicate service names.
 */
export const createMergedSubContainer = (main: MutableContainer): MergedSubContainer => {
  const sub = createMutableLockableContainer();
  const recursionStack = new Map<ServiceTag, () => SF>();

  function getService(serviceTag: ServiceTag) {
    return () => getCurrentService(serviceTag)();
  }

  function getCurrentService(serviceTag: ServiceTag): SF {
    if (!hasService(serviceTag)) {
      throw new Error(`Service "${serviceTag}" does not exists`);
    }
    if (!recursionStack.has(serviceTag)) {
      let called = false;
      const subCurrent = sub.getCurrentService(serviceTag);
      const mainCurrent = main.hasService(serviceTag) ? main.getCurrentService(serviceTag) : null;
      recursionStack.set(serviceTag, () => {
        return () => {
          if (mainCurrent && !called) {
            called = true;
            const instance = mainCurrent();
            recursionStack.delete(serviceTag);
            return instance;
          }
          recursionStack.delete(serviceTag);
          return subCurrent();
        };
      });
    }
    return recursionStack.get(serviceTag)!();
  }

  function services(): Array<[ServiceTag, SF]> {
    return [...main.services(), ...sub.services()];
  }

  function subServices(): Array<[ServiceTag, SF]> {
    return sub.services();
  }

  function currentServices(): [[ServiceTag, SF]] {
    return [...main.currentServices(), ...sub.currentServices()] as any;
  }

  function hasService(tag: ServiceTag) {
    return sub.hasService(tag) || main.hasService(tag);
  }

  function setService(tag: ServiceTag, sf: SF): MergedSubContainer {
    if (main.hasService(tag)) {
      main.setService(tag, sf);
    } else {
      sub.setService(tag, sf);
    }
    return createRecord();
  }

  function createRecord(): MergedSubContainer {
    return {
      hasService,
      services,
      getService,
      setService,
      getCurrentService,
      currentServices,
      lock: sub.lock,
      isLocked: sub.isLocked,
      subServices,
    };
  }

  return createRecord();
};
