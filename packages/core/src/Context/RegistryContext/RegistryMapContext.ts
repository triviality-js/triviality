import { ServiceKeysOfType, SF } from '../../ServiceFactory';
import { toPairs } from 'ramda';
import { GetService } from '../ServicesContext';

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

const getServices = <TDependencies, TType, TKey>(getService: GetService<TDependencies>, items: RegisterMapArguments<TDependencies, TType, TKey>): [TKey, SF<TType>][] => {
  const result: [TKey, SF<TType>][] = [];
  items.forEach(
    (arg: RegisterMapArgument<TDependencies, TType, TKey>) => {
      if (!(arg instanceof Array)) {
        return toPairs(arg).forEach(([tag, item]) => {
          result.push([tag, (typeof item === 'string' ? getService(item as any) : item)] as any as [TKey, SF<TType>]);
        });
      }
      {
        const [tag, item] = arg;
        result.push([tag, (typeof item === 'string' ? getService(item) : item)] as [TKey, SF<TType>]);
      }
    });

  return result;
};


export const registerToMap = <TDependencies, TType, TKey, TService>(getService: GetService<TDependencies>, parent: SF<TService>, ...items: RegisterMapArguments<TDependencies, TType, TKey>): TService => {
  const serverFactories = getServices<TDependencies, TType, TKey>(getService, items);
  let map = parent();
  serverFactories.forEach(([key, service]) => {
    map = (map as any).set(key, service());
  });
  return map;
}
