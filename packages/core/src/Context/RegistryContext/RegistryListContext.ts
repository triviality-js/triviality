import {
  isServiceFactory,
  isServiceTag,
  ServiceFactoryByTag,
  ServiceKeysOfType,
  serviceOfServiceFactories,
  SF,
} from '../../ServiceFactory';
import { makeImmutableRegistryList, RegistryList } from './ImmutableRegistryList';
import { ImmutableContainer, MutableContainer } from '../../Container';
import { cond, identity, map, once } from 'ramda';
import { wrapReturnAsReference } from '../ReferenceContext';

export type RegisterListArgument<Services, TType> = ServiceKeysOfType<Services, TType> | SF<TType>;
export type RegisterListArguments<Services, TType> = Array<RegisterListArgument<Services, TType>>;

export const REGISTER_LIST_ARGUMENTS = Symbol.for('REGISTER_LIST_ARGUMENTS');

export interface RegistryListContext<T> {
  registerList<TType>(...items: RegisterListArguments<T, TType>): SF<RegistryList<TType>>;
}

export type RegisterWithListArguments<T, TType> = (...items: RegisterListArguments<T, TType>) => {};

export type InferListArgumentRegisters<T> = {
  [K in keyof T]: T[K] extends {[REGISTER_LIST_ARGUMENTS]: infer TType} ? RegisterWithListArguments<T, TType> : unknown;
};

export const createFeatureFactoryRegistryListContext = <T>(container: MutableContainer): RegistryListContext<T> => ({
  registerList: wrapReturnAsReference(registerList<T, any>(container)),
});

export const getServices = <Services, T>(getService: ServiceFactoryByTag<T>) => (...items: RegisterListArguments<Services, T>): Array<SF<T>> =>
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
