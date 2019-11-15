import { MutableContainer } from '../../Container';
import {
  createFeatureFactoryRegistryListContext,
  RegistryListContext,
  InferListRegisters,
  RegisterListArgument,
  registerToList,
} from './RegistryListContext';
import {
  createFeatureFactoryRegistryMapContext,
  RegistryMapContext,
  InferMapRegisters,
  RegisterMapArgument,
  registerToMap,
} from './RegistryMapContext';
import { fromPairs } from 'ramda';
import { ServiceTag } from '../../ServiceFactory';

export type InferRegisters<T> = InferListRegisters<T> & InferMapRegisters<T>;

export interface RegistryContext<T> extends RegistryListContext<T>,
  RegistryMapContext<T> {
  registers: InferRegisters<T>;
}

export const registersTo = (container: MutableContainer, name: ServiceTag) => {
  return (...args: any) => {
    if (args.length === 0) {
      return {};
    }
    const first: RegisterMapArgument<unknown, unknown> | RegisterListArgument<unknown, unknown> = args[0];
    if (typeof first === 'function' || typeof first === 'string') {
      registerToList(container, name, ...args);
      return {};
    }
    registerToMap(container, name, ...args);
    return {};
  };
};

export const createFeatureFactoryRegisterContext = (container: MutableContainer) =>
  fromPairs(container.services().map(([name]) => [name, registersTo(container, name)]));

export const createFeatureFactoryRegistryContext = <T>(container: MutableContainer): RegistryContext<T> => ({
  ...createFeatureFactoryRegistryListContext(container),
  ...createFeatureFactoryRegistryMapContext(container),
  registers: createFeatureFactoryRegisterContext(container) as any,
});
