import { MutableContainer } from '../../Container';
import {
  createFeatureFactoryRegistryListContext,
  getServices,
  InferListArgumentRegisters,
  RegisterListArgument,
  RegisterListArguments,
  RegistryListContext,
} from './RegistryListContext';
import {
  createFeatureFactoryRegistryMapContext,
  InferMapArgumentsRegisters,
  RegisterMapArgument, registerToMap,
  RegistryMapContext,
} from './RegistryMapContext';
import { fromPairs, once } from 'ramda';
import { serviceOfServiceFactories, ServiceTag, SF } from '../../ServiceFactory';
import { makeImmutableRegistryList, RegistryList } from './ImmutableRegistryList';
import { createFeatureFactoryRegistrySetContext, RegistrySetContext } from './RegistrySetContext';

export type InferRegisters<T> = InferListArgumentRegisters<T> & InferMapArgumentsRegisters<T>;

export interface RegistryContext<T> extends RegistryListContext<T>,
  RegistryMapContext<T>,
  RegistrySetContext<T> {
  registers: InferRegisters<T>;
}

/**
 * It overrides the existing list, keeping the list itself immutable.
 */
export const registerToListOrSet = <Services, T>({ getService, setService, getCurrentService }: MutableContainer, registry: ServiceTag, ...items: RegisterListArguments<Services, T>) => {
  const service = getCurrentService(registry as ServiceTag) as SF<RegistryList<T>>;
  const serviceFactories = getServices<Services, T>(getService as any)(...items);
  setService(
    registry as ServiceTag,
    once(() => makeImmutableRegistryList<T>(...[...service(), ...serviceOfServiceFactories(serviceFactories)])),
  );
};

export const registersTo = (container: MutableContainer, name: ServiceTag) => {
  return (...args: any) => {
    if (args.length === 0) {
      return {};
    }
    const first: RegisterMapArgument<unknown, unknown, unknown> | RegisterListArgument<unknown, unknown> = args[0];
    if (typeof first === 'function' || typeof first === 'string') {
      registerToListOrSet(container, name, ...args);
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
  ...createFeatureFactoryRegistrySetContext(container),
  registers: createFeatureFactoryRegisterContext(container) as any,
});
