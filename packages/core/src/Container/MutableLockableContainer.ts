import { lockAble } from '../lib';
import { ServiceTag, SF } from '../ServiceFactory';
import { createImmutableContainer, ImmutableContainer } from './ImmutableContainer';
import { MutableContainer } from './MutableContainer';
import { fromPairs, once } from 'ramda';

export interface MutableLockableContainer extends MutableContainer {
  lock(): Record<string, SF<unknown>>;

  isLocked(): boolean;
}

export const createMutableLockableContainer = (container: ImmutableContainer = createImmutableContainer()): MutableLockableContainer => {
  const { isLocked, lock: lockMutable } = lockAble();
  let updatedContainer = container;
  const reference: Record<string, SF> = {};

  function lock(): Record<string, SF<unknown>> {
    lockMutable();
    Object.assign(reference, fromPairs(services()));
    return reference;
  }

  function getService(serviceTag: ServiceTag) {
    return once(() => getCurrentService(serviceTag)());
  }

  function getCurrentService(serviceTag: ServiceTag): SF {
    const service = updatedContainer.getService(serviceTag);
    return once(() => {
      if (!isLocked()) {
        throw new Error(`Cannot get "${serviceTag}" service when container is unlocked`);
      }
      return service();
    });
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
    updatedContainer = updatedContainer.setService(tag, sf.bind(reference));
    /* istanbul ignore next */
    reference[tag] = () => { throw new Error(`Cannot get "${tag}" service when container is unlocked`); };
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
