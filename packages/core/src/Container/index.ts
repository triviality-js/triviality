import { ServiceTag, SF, TagServicePair } from '../ServiceFactory';
import { forEach } from 'ramda';
import { ImmutableContainer } from './ImmutableContainer';

export * from './ImmutableContainer';
export * from './MutableContainer';
export * from './MutableLockableContainer';

export const setServices = (setService: (tag: ServiceTag, sf: SF) => void) => (sfs: TagServicePair[]): void =>
  void forEach(([name, service]) => setService(name, service), sfs);

export const setNewServiceToContainer = <T extends ImmutableContainer>({ hasService, setService }: T) => (k: ServiceTag, sf: SF): T => {
  if (hasService(k)) {
    throw new Error(`Service ${k} already exists`);
  }
  return setService(k, sf);
};
