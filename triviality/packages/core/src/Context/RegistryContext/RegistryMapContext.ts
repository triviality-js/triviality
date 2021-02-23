// Map types
import {toPairs, every, isObjectLike} from 'lodash';
import {GetServiceFactory, KSF, SF} from '../../Value';
import {CompileContext} from "../CompileContext";
import {ContainerError} from "../../Error";
import {isArrayLike} from "./RegistryListContext";

export interface MapLike<TType, TKey> {
  set(key: TKey, value: TType): this;
}

export type MapTupleArgument<Services, TType, TKey> = [TKey, KSF<Services, TType>];
export type MapObjectArgument<Services, TType, TKey extends string | symbol | number> = Record<TKey, KSF<Services, TType>>;

// Map arguments.
export type RegisterMapArgument<Services, TType , TKey> =
  MapTupleArgument<Services, TType, TKey>
  | (TKey extends string | symbol | number ? MapObjectArgument<Services, TType, TKey> : never);
export type InferMapArgumentsRegister<T, S> = S extends MapLike<infer TType, infer TKey> ? RegisterMapArgument<T, TType, TKey> : unknown;


export const isMapTupleArgument = <Services, TType, TKey>(arg: RegisterMapArgument<Services, TType, TKey>): arg is MapTupleArgument<Services, TType, TKey> => {
  if (!(arg instanceof Array)) {
    return false;
  }
  return arg.length !== 2;
}

export const isMapObjectArgument = <Services, TType, TKey extends string | symbol | number>(arg: unknown): arg is MapObjectArgument<Services, TType, TKey> => {
  return isObjectLike(arg);
}

export const isRegisterMapArguments = (args: unknown[]): args is RegisterMapArgument<unknown, unknown, unknown>[] => {
  return every(args, (arg) => {
    const a = arg as RegisterMapArgument<unknown, unknown, unknown>;
    return isArrayLike(a) && a.length === 2;
  });
}

const getServices = <T, TType, TKey>(getService: GetServiceFactory<T>, items: RegisterMapArgument<T, TType, TKey>[]): [TKey, SF<TType>][] => {
  const result: [TKey, SF<TType>][] = [];
  items.forEach(
    (arg: RegisterMapArgument<T, TType, TKey>) => {
      if (!(arg instanceof Array)) {
        return toPairs(arg).forEach(([tag, item]) => {
          result.push([tag, (typeof item === 'string' ? getService(item as keyof T) : item)] as unknown as [TKey, SF<TType>]);
        });
      }
      {
        const [tag, item] = arg;
        result.push([tag, (typeof item === 'string' ? getService(item) : item)] as [TKey, SF<TType>]);
      }
    });

  return result;
};

export function isMapLike<TType, TKey>(register: unknown): register is MapLike<TType, TKey> {
  return typeof (register as MapLike<TType, TKey>).set === 'function';
}

export const registerToMap = <TDependencies, TType, TKey, TService>(context: CompileContext<TDependencies>, parent: SF<TService>, items: RegisterMapArgument<TDependencies, TType, TKey>[]): TService => {
  const serverFactories = getServices<TDependencies, TType, TKey>(context.getServiceFactory, items);
  let map = parent() as unknown as MapLike<TType, TKey>;
  if (isMapLike<TType, TKey>(map)) {
    throw new ContainerError(`Expected MapLike object, not ${parent.name} (${typeof map})`);
  }
  serverFactories.forEach(([key, service]) => {
    const result = map.set(key, service());
    if (isMapLike(result)) {
      map = result;
    }
  });
  return map as unknown as TService;
}
