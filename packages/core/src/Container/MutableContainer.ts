import { ServiceTag, SF } from '../ServiceFactory';
import { createImmutableContainer, ImmutableContainer } from './ImmutableContainer';

export interface MutableContainer extends ImmutableContainer {
  getCurrentService(k: ServiceTag): SF<unknown>;

  currentServices(): [[ServiceTag, SF]];
}

export const createMutableContainer = (container: ImmutableContainer = createImmutableContainer()): MutableContainer => {
  let updatedContainer = container;

  function getService(serviceTag: ServiceTag) {
    return () => getCurrentService(serviceTag)();
  }

  function getCurrentService(serviceTag: ServiceTag): SF {
    if (!hasService(serviceTag)) {
      throw new Error(`Service "${serviceTag}" does not exists`);
    }
    const service = updatedContainer.getService(serviceTag);
    return () => {
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

  function setService(tag: ServiceTag, sf: SF): MutableContainer {
    updatedContainer = updatedContainer.setService(tag, sf);
    return createRecord();
  }

  function createRecord() {
    return {
      hasService,
      services,
      getService,
      setService,
      getCurrentService,
      currentServices,
    };
  }

  return createRecord();
};
