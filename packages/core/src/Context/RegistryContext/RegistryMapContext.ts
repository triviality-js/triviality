import { ServiceFactoryByTag, ServiceKeysOfType, ServiceTag, SF } from '../../ServiceFactory';
import {
  ImmutableRegistryMap,
  makeImmutableRegistryMap,
  REGISTER_MAP_ARGUMENTS,
  RegistryMap,
} from './ImmutableRegistryMap';
import { toPairs } from 'ramda';
import { wrapReturnAsReference } from '../ReferenceContext';
import { Override } from '../../Value/Override';
import { ServiceFunctionReferenceContainerInterface } from '../../Containerd/ServiceFunctionReferenceContainerInterface';

export type RegisterMapArgument<Services, TType, TKey> =
  [TKey, ServiceKeysOfType<Services, TType> | SF<TType>]
  | (TKey extends string | symbol | number ? Record<TKey, SF<TType> | ServiceKeysOfType<Services, TType>> : never);
export type RegisterMapArguments<Services, TType, TKey> = RegisterMapArgument<Services, TType, TKey>[];

export interface RegistryMapContext<Services> {
  registerMap<TType, TKey = string>(...items: RegisterMapArguments<Services, TType, TKey>): SF<ImmutableRegistryMap<TType, TKey>>;
}

export const createFeatureFactoryRegistryMapContext = <Services>(container: ServiceFunctionReferenceContainerInterface): RegistryMapContext<Services> => {
  return {
    registerMap: wrapReturnAsReference(registerMap<Services>(container.getService)),
  };
};

export type registerWithMapArguments<Services, TType, TKey> = (...items: RegisterMapArguments<Services, TType, TKey>) => {};

export type InferMapArgumentsRegisters<T> = {
  [K in keyof T]: T[K] extends { [REGISTER_MAP_ARGUMENTS]: [infer TType, infer TKey] } ? registerWithMapArguments<T, TType, TKey> : unknown;
};

const getServices = <Services, TType, TKey>(getService: ServiceFactoryByTag<TType>, items: RegisterMapArguments<Services, TType, TKey>): [TKey, SF<TType>][] => {
  const result: [TKey, SF<TType>][] = [];
  items.forEach(
    (arg: RegisterMapArgument<Services, TType, TKey>) => {
      if (!(arg instanceof Array)) {
        return toPairs(arg).forEach(([tag, item]) => {
          result.push([tag, (typeof item === 'string' ? getService(item) : item)] as any as [TKey, SF<TType>]);
        });
      }
      {
        const [tag, item] = arg;
        result.push([tag, (typeof item === 'string' ? getService(item) : item)] as [TKey, SF<TType>]);
      }
    });

  return result;
};

const mapServices = <TType, TKey>(services: [TKey, SF<TType>][]): [TKey, TType][] => services.map(
  ([tag, sf]) => [tag, sf()]) as any;

export const registerMap = <Services>(getService: ServiceFactoryByTag<any>) => <TType, TKey>(...args: RegisterMapArguments<Services, TType, TKey>): SF<ImmutableRegistryMap<TType, TKey>> => {
  const factories = getServices<Services, TType, TKey>(getService, args);
  return () => makeImmutableRegistryMap<TType, TKey>(...mapServices<TType, TKey>(factories));
};

export const registerToMap = <Services, TType, TKey>(container: ServiceFunctionReferenceContainerInterface, registry: ServiceTag, ...items: RegisterMapArguments<Services, TType, TKey>): void => {
  const serverFactories = getServices<Services, TType, TKey>(container.getService, items);
  container.override(new Override<RegistryMap<TType, TKey>>({
    tag: registry,
    override: (service) => {
      return service().register(...mapServices(serverFactories));
    },
  }));
};
