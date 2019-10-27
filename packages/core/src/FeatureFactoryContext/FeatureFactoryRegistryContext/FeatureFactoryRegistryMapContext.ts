import { ServiceFactoryByTag, ServiceFactoryKeysOfType, ServiceTag, SF } from '../../ServiceFactory';
import {
  ImmutableRegistryMap,
  makeImmutableRegistryMap,
  MapRegistries,
  RegistryMap,
  RegistryTag,
} from './ImmutableRegistryMap';
import { MutableContainer } from '../../container';
import { toPairs } from 'ramda';

export type RegisterMapArgument<Services, TType> =
  [RegistryTag, ServiceFactoryKeysOfType<Services, TType> | SF<TType>]
  | Record<RegistryTag, SF<TType> | ServiceFactoryKeysOfType<Services, TType>>;
export type RegisterMapArguments<Services, TType> = Array<RegisterMapArgument<Services, TType>>;

export interface FeatureFactoryRegistryMapContext<Services> {
  registerMap<TType>(...items: RegisterMapArguments<Services, TType>): SF<ImmutableRegistryMap<TType>>;

  registerToMap<TType>(registry: keyof MapRegistries<Services, TType>, ...items: RegisterMapArguments<Services, TType>): void;
}

export const createFeatureFactoryRegistryMapContext = <Services>(container: MutableContainer): FeatureFactoryRegistryMapContext<Services> => {
  return {
    registerMap: registerMap<Services>(container.getService),
    registerToMap: registerToMap(container),
  };
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

export const registerToMap = <Services, TType>({ getService, setService }: MutableContainer) => (registry: keyof MapRegistries<Services, TType>, ...items: RegisterMapArguments<Services, TType>): void => {
  const service = getService(registry as ServiceTag) as SF<RegistryMap<TType>>;
  const serverFactories = getServices<Services, TType>(getService as any, items);
  setService(
    registry as ServiceTag,
    () => makeImmutableRegistryMap<TType>(...[...service(), ...mapServices(serverFactories)]),
  );
};
