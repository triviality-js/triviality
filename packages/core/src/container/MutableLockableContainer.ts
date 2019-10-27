import { lockAble } from '../lib';
import { ServiceTag, SF } from '../ServiceFactory';
import { createImmutableContainer, ImmutableContainer } from './ImmutableContainer';
import { MutableContainer } from './MutableContainer';

export interface MutableLockableContainer extends MutableContainer {
  lock(): ImmutableContainer;

  isLocked(): boolean;
}

export const createMutableLockableContainer = (container: ImmutableContainer = createImmutableContainer()): MutableLockableContainer => {
  const { isLocked, lock: lockMutable } = lockAble(false);
  let updatedContainer = container;

  function lock(): ImmutableContainer {
    lockMutable();
    return updatedContainer;
  }

  function getService(serviceTag: ServiceTag) {
    if (!hasService(serviceTag)) {
      throw new Error(`Service "${serviceTag}" does not exists`);
    }
    return () => getCurrentService(serviceTag)();
  }

  function getCurrentService(serviceTag: ServiceTag): SF {
    const service = updatedContainer.getService(serviceTag);
    return () => {
      if (!isLocked()) {
        throw new Error(`Cannot get "${serviceTag}" service when container is unlocked`);
      }
      return service();
    };
  }

  function services(): [[ServiceTag, SF]] {
    return updatedContainer.services().map(([key]) => [key, getService(key)]) as any;
  }

  function currentServices(): [[ServiceTag, SF]] {
    return updatedContainer.services();
  }

  function hasService(tag: ServiceTag) {
    return updatedContainer.hasService(tag);
  }

  function setService(tag: ServiceTag, sf: SF): MutableLockableContainer {
    if (isLocked()) {
      throw new Error(`Cannot set "${tag}" service when container is locked`);
    }
    updatedContainer = updatedContainer.setService(tag, sf);
    return createRecord();
  }

  function createRecord() {
    return {
      hasService,
      services,
      getService,
      setService,
      isLocked,
      lock,
      getCurrentService,
      currentServices,
    };
  }

  return createRecord();
};
