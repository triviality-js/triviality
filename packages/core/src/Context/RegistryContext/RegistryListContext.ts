import {
  isServiceFactory,
  isServiceTag,
  ServiceFactoryByTag,
  ServiceKeysOfType,
  serviceOfServiceFactories,
  SF,
} from '../../ServiceFactory';
import { makeImmutableRegistryList, REGISTER_LIST_ARGUMENTS, RegistryList } from './ImmutableRegistryList';
import { cond, identity, map } from 'ramda';
import { wrapReturnAsReference } from '../ReferenceContext';
import { ServiceFunctionReferenceContainerInterface } from '../../Container/ServiceFunctionReferenceContainerInterface';

export type RegisterListArgument<Services, TType> = ServiceKeysOfType<Services, TType> | SF<TType>;
export type RegisterListArguments<Services, TType> = RegisterListArgument<Services, TType>[];

export interface RegistryListContext<T> {
  registerList<TType>(...items: RegisterListArguments<T, TType>): SF<RegistryList<TType>>;
}

export type RegisterWithListArguments<T, TType> = (...items: RegisterListArguments<T, TType>) => {};

export type InferListArgumentRegisters<T> = {
  [K in keyof T]: T[K] extends { [REGISTER_LIST_ARGUMENTS]: infer TType } ? RegisterWithListArguments<T, TType> : unknown;
};

export const createFeatureFactoryRegistryListContext = <T>(container: ServiceFunctionReferenceContainerInterface): RegistryListContext<T> => ({
  registerList: wrapReturnAsReference(registerList<T, any>(container)),
});

export const getServices = <Services, T>(getService: ServiceFactoryByTag<T>) => (...items: RegisterListArguments<Services, T>): SF<T>[] =>
  map(
    cond([
      [isServiceFactory, identity],
      [isServiceTag, getService],
    ]),
    items,
  );

export function registerList<Services, T>({ getService }: ServiceFunctionReferenceContainerInterface): (...items: RegisterListArguments<Services, T>) => SF<RegistryList<T>> {
  return (...items: RegisterListArguments<Services, T>) => {
    const serviceReferences = getServices<Services, T>(getService as any)(...items);
    return () => makeImmutableRegistryList<T>(...serviceOfServiceFactories(serviceReferences));
  };
}
