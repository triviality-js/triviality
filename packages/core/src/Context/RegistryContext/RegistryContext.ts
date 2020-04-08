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
  RegisterMapArgument,
  registerToMap,
  RegistryMapContext,
} from './RegistryMapContext';
import { fromPairs } from 'ramda';
import { serviceOfServiceFactories, ServiceTag } from '../../ServiceFactory';
import { RegistryList } from './ImmutableRegistryList';
import { createFeatureFactoryRegistrySetContext, RegistrySetContext } from './RegistrySetContext';
import { Override } from '../../Value/Override';
import { RegistrySet } from './ImmutableRegistrySet';
import { ServiceFunctionReferenceContainerInterface } from '../../Container/ServiceFunctionReferenceContainerInterface';

export type InferRegisters<T> = InferListArgumentRegisters<T> & InferMapArgumentsRegisters<T>;

export interface RegistryContext<T> extends RegistryListContext<T>,
  RegistryMapContext<T>,
  RegistrySetContext<T> {
  registers: InferRegisters<T>;
}

/**
 * It overrides the existing list, keeping the list itself immutable.
 */
export const registerToListOrSet = <Services, T>(container: ServiceFunctionReferenceContainerInterface, registry: ServiceTag, ...items: RegisterListArguments<Services, T>) => {
  const serviceFactories = getServices<Services, T>(container.getService as any)(...items);
  container.override(new Override<RegistryList<any> | RegistrySet<any>>({
    tag: registry,
    override: (service) => {
      return service().register(...[...serviceOfServiceFactories(serviceFactories)]);
    },
  }));
};

export const registersTo = (container: ServiceFunctionReferenceContainerInterface, name: ServiceTag) => {
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

export const createFeatureFactoryRegisterContext = (container: ServiceFunctionReferenceContainerInterface) =>
  fromPairs(container.references().taggedPairs().map(([name]) => [name, registersTo(container, name)]));

export const createFeatureFactoryRegistryContext = <T>(container: ServiceFunctionReferenceContainerInterface): RegistryContext<T> => ({
  ...createFeatureFactoryRegistryListContext(container),
  ...createFeatureFactoryRegistryMapContext(container),
  ...createFeatureFactoryRegistrySetContext(container),
  registers: createFeatureFactoryRegisterContext(container) as any,
});
