import {
  isServiceFactory,
  ServiceKeysOfType,
  SF,
} from '../../ServiceFactory';
import { cond, identity, map } from 'ramda';
import { isObjectLike, isString } from 'lodash';
import { OverrideWith } from '../OverrideContext';
import { GetService } from '../ServicesContext';

export type RegisterListArgument<TDependencies, TType> = ServiceKeysOfType<TDependencies, TType> | SF<TType>;
export type RegisterListArguments<TDependencies, TType> = RegisterListArgument<TDependencies, TType>[];

export const isRegisterListArguments = (args: unknown[]): args is RegisterListArguments<unknown, unknown> => {
  if (args.length === 0) {
    return false;
  }
  return typeof args[0] === 'function' || typeof args[0] === 'string';
}

export type ListLike<T> = SetLike<T> | ArrayLike<T> | RegisterLike<T>;

export type InferListArgumentRegisters<TDependencies> = {
  [K in keyof TDependencies]: TDependencies[K] extends ListLike<infer TType> ? RegisterWithListArguments<TDependencies, K, TType> : unknown;
};

export interface SetLike<T> {
  add(item: T): this | unknown;
}

export interface ArrayLike<T> {
  push(item: T): this | unknown;
}

export interface RegisterLike<T> {
  register(item: T): this | unknown;
}

export function isListLike<T>(register: unknown): register is ListLike<T> {
  return isObjectLike(register) && isSetLike(register as any) || isArrayLike(register as any) || isRegisterLike(register as any);
}

export function isSetLike<T>(register: ListLike<T>): register is SetLike<T> {
  return typeof (register as any).add === 'function';
}

export function isArrayLike<T>(register: ListLike<T>): register is ArrayLike<T> {
  return typeof (register as any).push === 'function';
}

export function isRegisterLike<T>(register: ListLike<T>): register is RegisterLike<T> {
  return typeof (register as any).register === 'function';
}

export type RegisterWithListArguments<T, K extends keyof T, TType> = (...items: RegisterListArguments<T, TType>) => Record<K, OverrideWith<T[K]>>;

export const getServices = <TDependencies, TType>(getService: GetService<TDependencies>, ...items: RegisterListArguments<TDependencies, TType>): SF<TType>[] =>
  map(
    cond([
      [isServiceFactory, identity],
      [isString, getService],
    ]),
    items,
  );

export function registerToList<TDependencies, TService, TType>(getService: GetService<TDependencies>, parent: SF<TService>, ...items: RegisterListArguments<TDependencies, TType>): TService {
  const serverFactories = getServices<TDependencies, TType>(getService, ...items);
  let arrayLike: any = parent();
  if (isListLike<TType>(arrayLike)) {
    throw new Error('Expected ListLike object, not ' + arrayLike);
  }
  for (const sf of serverFactories) {
    let result: unknown;
    const instance = sf();
    if (isArrayLike(arrayLike)) {
      result = arrayLike.push(instance);
    } else if (isRegisterLike(arrayLike)) {
      result = arrayLike.register(instance);
    } else if (isSetLike(arrayLike)) {
      result = arrayLike.add(instance);
    } else {
      throw new Error('Expected ListLike object, not ' + arrayLike);
    }
    if (isListLike(result)) {
      arrayLike = result;
    }
  }
  return arrayLike;
}
