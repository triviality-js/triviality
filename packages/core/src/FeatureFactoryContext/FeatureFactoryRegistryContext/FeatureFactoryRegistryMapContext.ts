import { InferServiceType, ServiceFactoryByTag, ServiceFactoryKeysOfType, ServiceTag, SF } from '../../ServiceFactory';
import { ImmutableRegistryMap, makeImmutableRegistryMap, RegistryMap, RegistryTag } from './ImmutableRegistryMap';
import { MutableContainer } from '../../Container';
import { toPairs } from 'ramda';
import { wrapReturnAsReference } from '../FeatureFactoryReferenceContext';

export type RegisterMapArgument<Services, TType> =
  [RegistryTag, ServiceFactoryKeysOfType<Services, TType> | SF<TType>]
  | Record<RegistryTag, SF<TType> | ServiceFactoryKeysOfType<Services, TType>>;
export type RegisterMapArguments<Services, TType> = Array<RegisterMapArgument<Services, TType>>;

export interface FeatureFactoryRegistryMapContext<Services> {
  registerMap<TType>(...items: RegisterMapArguments<Services, TType>): SF<ImmutableRegistryMap<TType>>;
}

export const createFeatureFactoryRegistryMapContext = <Services>(container: MutableContainer): FeatureFactoryRegistryMapContext<Services> => {
  return {
    registerMap: wrapReturnAsReference(registerMap<Services>(container.getService)),
  };
};

export type registerToMap<Services, TType> = (...items: RegisterMapArguments<Services, TType>) => {};

export type InferMapRegisters<T> = {
  [K in keyof T]: InferServiceType<T[K]> extends ImmutableRegistryMap<infer TType> ? registerToMap<T, TType> : unknown;
};

const getServices = <Services, T>(getService: ServiceFactoryByTag<T>, items: RegisterMapArguments<Services, T>): Array<[string, SF<T>]> => {
  const result: Array<[string, SF<T>]> = [];
  items.forEach(
    (arg: RegisterMapArgument<Services, T>) => {
      if (!(arg instanceof Array)) {
        return toPairs(arg).forEach(([tag, item]) => {
          result.push([tag, (typeof item === 'string' ? getService(item) : item)] as [ServiceTag, SF<T>]);
        });
      }
      {
        const [tag, item] = arg;
        result.push([tag, (typeof item === 'string' ? getService(item) : item)] as [ServiceTag, SF<T>]);
      }
    });

  return result;
};

const mapServices = <T>(services: Array<[ServiceTag, SF<T>]>): Array<[ServiceTag, T]> => services.map(
  ([tag, sf]) => [tag, sf()]) as any;

export const registerMap = <Services>(getService: ServiceFactoryByTag<any>) => <TType>(...args: RegisterMapArguments<Services, TType>): SF<ImmutableRegistryMap<TType>> => {
  const factories = getServices<Services, TType>(getService, args);
  return () => makeImmutableRegistryMap(...mapServices<TType>(factories));
};

export const registerToMap = <Services, TType>({ getService, getCurrentService, setService }: MutableContainer, registry: ServiceTag, ...items: RegisterMapArguments<Services, TType>): void => {
  const service: SF<RegistryMap<TType>> = getCurrentService(registry as ServiceTag) as SF<RegistryMap<TType>>;
  const serverFactories = getServices<Services, TType>(getService as any, items);
  setService(
    registry as ServiceTag,
    () => makeImmutableRegistryMap<TType>(...[...service(), ...mapServices(serverFactories)]),
  );
};
