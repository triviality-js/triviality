import {KSF, SF, SFR, USF} from "../../Value";
import {isObjectLike, isString} from "lodash";
import {CompileContext} from "../CompileContext";
import {ContainerError} from "../../Error";
import {asServiceFactoryReference} from "../../serviceReferenceFactoryInterface";

export interface SetLike<T> {
  add(item: T): this | unknown;
}

export interface ArrayLike<T> {
  push(item: T): this | unknown;
}

export interface RegisterLike<T> {
  register(item: T): this | unknown;
}

export type ListLike<T> = SetLike<T> | ArrayLike<T> | RegisterLike<T>;

export type RegisterListArgument<TDependencies, TType> = KSF<TDependencies, TType>;
export type InferListArgumentRegister<T, S> = S extends ListLike<infer TType> ? RegisterListArgument<T, TType> : unknown;

export const isRegisterListArguments = (args: unknown[]): args is RegisterListArgument<unknown, unknown>[] => {
  return typeof args[0] === 'function' || typeof args[0] === 'string';
}

export function isListLike<T>(register: unknown): register is ListLike<T> {
  return isObjectLike(register) && (isSetLike(register as ListLike<T>) || isArrayLike(register as ListLike<T>) || isRegisterLike(register as ListLike<T>));
}

export function isSetLike<T>(register: ListLike<T>): register is SetLike<T> {
  return typeof (register as SetLike<T>).add === 'function';
}

export function isArrayLike<T>(register: ListLike<T>): register is ArrayLike<T> {
  return typeof (register as ArrayLike<T>).push === 'function';
}

export function isRegisterLike<T>(register: ListLike<T>): register is RegisterLike<T> {
  return typeof (register as RegisterLike<T>).register === 'function';
}

export function registerToList<T, TService, TType>(context: CompileContext<T>, parent: SFR<TService>, items: RegisterListArgument<T, TType>[]): TService {
  const serverFactories: SF<TType>[] = items.map((item): SF<TType> => {
    if (isString(item)) {
      return context.getServiceFactory(item as keyof T) as unknown as SF<TType>;
    }
    return asServiceFactoryReference(item as USF) as SF<TType>;
  });
  let arrayLike = parent() as unknown as ListLike<TType>;
  if (!isListLike<TType>(arrayLike)) {
    throw new ContainerError(`Expected ListLike object, not ${parent.name} (${typeof arrayLike})`);
  }
  for (const sf of serverFactories) {
    let result: unknown;
    const instance: TType = sf();
    if (isArrayLike(arrayLike)) {
      result = arrayLike.push(instance);
    } else if (isRegisterLike(arrayLike)) {
      result = arrayLike.register(instance);
    } else if (isSetLike(arrayLike)) {
      result = arrayLike.add(instance);
    } else {
      throw new ContainerError(`Expected ListLike object, not ${parent.name} (${typeof arrayLike})`);
    }
    if (isListLike(result)) {
      arrayLike = result;
    }
  }
  return arrayLike as unknown as TService;
}

