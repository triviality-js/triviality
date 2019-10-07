import { once } from 'ramda';
import { SF } from './ServiceFactory';

export interface Container {
  getUpdatedServiceReference(k: string): SF<unknown>;

  getCurrentServiceReference(k: string): SF<any>;

  setService(k: string, sf: SF<unknown>): LockableContainer;

  setNewService(k: string, sf: SF<unknown>): LockableContainer;

  setNewServices(services: { [key: string]: SF<unknown> }): LockableContainer;

  hasService(k: string): boolean;
}

export interface LockableContainer extends Container {
  lock(): void;

  isLocked(): boolean;
}

export const createLockableContainer = (): LockableContainer => {
  let locked = false;
  const container = new Map<string, SF<unknown>>();

  function getService(k: string): SF<any> {
    const service = container.get(k);
    if (!service) {
      throw new Error(`${k} not found`);
    }
    return service;
  }

  return {
    /**
     * Always return latest service function, when new service is set.
     */
    getUpdatedServiceReference(k: string): SF<any> {
      if (!this.hasService(k)) {
        throw new Error(`Service ${k} does not exists`);
      }
      return () => {
        if (!locked) {
          throw new Error('When container is unlocked, services factories should not be called');
        }
        return getService(k)();
      };
    },
    /**
     * Return current service reference
     */
    getCurrentServiceReference(k: string): SF<any> {
      if (this.hasService(k)) {
        throw new Error(`Service ${k} does not exists`);
      }
      const service = getService(k);
      return () => {
        if (!locked) {
          throw new Error('When container is unlocked, services factories should not be called');
        }
        return service();
      };
    },
    setService(k: string, sf: SF<unknown>) {
      if (locked) {
        throw new Error('Container is locked no new service can be set');
      }
      container.set(k.toString(), once(sf));
      return this;
    },
    setNewService(k: string, sf: SF<unknown>) {
      if (locked) {
        throw new Error('Container is locked no new service can be set');
      }
      if (this.hasService(k)) {
        throw new Error(`Service ${k} already exists`);
      }
      return this.setService(k, sf);
    },
    setNewServices(services) {
      Object.entries(services).forEach(([name, service]) => this.setNewService(name, service));
      return this;
    },
    hasService(k: string): boolean {
      return container.has(k);
    },
    lock() {
      if (locked) {
        throw new Error('Container is already locked');
      }
      locked = true;
    },
    isLocked() {
      return locked;
    },
  };
};
