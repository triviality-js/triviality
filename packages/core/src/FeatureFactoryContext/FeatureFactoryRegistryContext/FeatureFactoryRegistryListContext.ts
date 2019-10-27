import {
  isServiceFactory,
  isServiceTag,
  ServiceFactoryByTag,
  ServiceFactoryKeysOfType,
  serviceOfServiceFactories,
  ServiceTag,
  SF,
} from '../../ServiceFactory';
import { ListRegistries, makeImmutableRegistryList, RegistryList } from './ImmutableRegistryList';
import { ImmutableContainer, MutableContainer } from '../../container';
import { cond, identity, map } from 'ramda';

export type RegisterListArgument<Services, TType> = ServiceFactoryKeysOfType<Services, TType> | SF<TType>;
export type RegisterListArguments<Services, TType> = Array<RegisterListArgument<Services, TType>>;

export interface FeatureFactoryRegistryListContext<T> {
  registerList<TType>(...items: RegisterListArguments<T, TType>): SF<RegistryList<TType>>;

  registerToList<TType>(registry: keyof ListRegistries<T, TType>, ...items: RegisterListArguments<T, TType>): void;
}

export const createFeatureFactoryRegistryListContext = <T>(container: MutableContainer): FeatureFactoryRegistryListContext<T> => ({
  registerList: registerList<T, any>(container),
  registerToList: registerToList<T, any>(container),
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
    return () => makeImmutableRegistryList<T>(...serviceOfServiceFactories(serviceReferences));
  };
}

/**
 * It overrides the existing list, keeping the list itself immutable.
 */
export const registerToList = <Services, T>({ getService, setService }: MutableContainer) => (registry: keyof ListRegistries<Services, T>, ...items: RegisterListArguments<Services, T>) => {
  const service = getService(registry as ServiceTag) as SF<RegistryList<T>>;
  const serverFactories = getServices<Services, T>(getService as any)(...items);
  setService(
    registry as ServiceTag,
    () => makeImmutableRegistryList<T>(...[...service(), ...serviceOfServiceFactories(serverFactories)]),
  );
};
