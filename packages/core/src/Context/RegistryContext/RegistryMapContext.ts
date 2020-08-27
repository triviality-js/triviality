import {ServiceFactoryByTag, ServiceKeysOfType, ServiceTag, SF} from '../../ServiceFactory';
import {ServiceFunctionReferenceContainerInterface} from "../../Container/ServiceFunctionReferenceContainerInterface";
import {Override} from "../../Value/Override";
import {toPairs} from "ramda";

export type RegisterMapArgument<Services, TType, TKey> =
  [TKey, ServiceKeysOfType<Services, TType> | SF<TType>]
  | (TKey extends string | symbol | number ? Record<TKey, SF<TType> | ServiceKeysOfType<Services, TType>> : never);

export type RegisterMapArguments<Services, TType, TKey> = RegisterMapArgument<Services, TType, TKey>[];

export type registerWithMapArguments<Services, TType, TKey> = (...items: RegisterMapArguments<Services, TType, TKey>) => {};

export type InferMapArgumentsRegisters<T> = {
    [K in keyof T]: T[K] extends MapLike<infer TType, infer TKey> ? registerWithMapArguments<T, TType, TKey> : unknown;
};

export interface MapLike<TType, TKey> {
  set(key: TKey, value: TType): this;
}

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

export const registerToMap = <Services, TType, TKey>(container: ServiceFunctionReferenceContainerInterface, registry: ServiceTag, ...items: RegisterMapArguments<Services, TType, TKey>): void => {
  const serverFactories = getServices<Services, TType, TKey>(container.getService, items);
  container.override(new Override<MapLike<TType, TKey>>({
    tag: registry,
    override: (service) => {
      let map = service();
      serverFactories.forEach(([key, service]) => {
        map = map.set(key, service());
      });
      return map;
    },
  }));
};
