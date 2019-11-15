import {
  isServiceFactory,
  isServiceTag,
  ServiceFactoryByTag,
  ServiceKeysOfType,
  serviceOfServiceFactories,
  ServiceTag,
  SF,
} from '../../ServiceFactory';
import { ImmutableRegistryList, makeImmutableRegistryList, RegistryList } from './ImmutableRegistryList';
import { ImmutableContainer, MutableContainer } from '../../Container';
import { cond, identity, map, once } from 'ramda';
import { wrapReturnAsReference } from '../ReferenceContext';

export type RegisterListArgument<Services, TType> = ServiceKeysOfType<Services, TType> | SF<TType>;
export type RegisterListArguments<Services, TType> = Array<RegisterListArgument<Services, TType>>;

export interface RegistryListContext<T> {
  registerList<TType>(...items: RegisterListArguments<T, TType>): SF<RegistryList<TType>>;
}

export type RegisterToList<T, TType> = (...items: RegisterListArguments<T, TType>) => {};

export type InferListRegisters<T> = {
  [K in keyof T]: T[K] extends ImmutableRegistryList<infer TType> ? RegisterToList<T, TType> : unknown;
};

export const createFeatureFactoryRegistryListContext = <T>(container: MutableContainer): RegistryListContext<T> => ({
  registerList: wrapReturnAsReference(registerList<T, any>(container)),
});

const getServices = <Services, T>(getService: ServiceFactoryByTag<T>) => (...items: RegisterListArguments<Services, T>): Array<SF<T>> =>
  map(
    cond([
      [isServiceFactory, identity],
      [isServiceTag, getService],
    ]),
    items,
  );

export function registerList<Services, T>({ getService }: ImmutableContainer): (...items: RegisterListArguments<Services, T>) => SF<RegistryList<T>> {
  return (...items: RegisterListArguments<Services, T>) => {
    const serviceReferences = getServices<Services, T>(getService as any)(...items);
    return once(() => makeImmutableRegistryList<T>(...serviceOfServiceFactories(serviceReferences)));
  };
}

/**
 * It overrides the existing list, keeping the list itself immutable.
 */
export const registerToList = <Services, T>({ getService, setService, getCurrentService }: MutableContainer, registry: ServiceTag, ...items: RegisterListArguments<Services, T>) => {
  const service = getCurrentService(registry as ServiceTag) as SF<RegistryList<T>>;
  const serviceFactories = getServices<Services, T>(getService as any)(...items);
  setService(
    registry as ServiceTag,
    once(() => makeImmutableRegistryList<T>(...[...service(), ...serviceOfServiceFactories(serviceFactories)])),
  );
};
