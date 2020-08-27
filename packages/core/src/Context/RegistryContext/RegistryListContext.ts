import {
    isServiceFactory,
    isServiceTag,
    ServiceFactoryByTag,
    ServiceKeysOfType,
    ServiceTag,
    SF,
} from '../../ServiceFactory';
import {cond, identity, map} from 'ramda';
import {isObjectLike} from 'lodash';
import {ServiceFunctionReferenceContainerInterface} from '../../Container/ServiceFunctionReferenceContainerInterface';
import {Override} from "../../Value/Override";

export type RegisterListArgument<Services, TType> = ServiceKeysOfType<Services, TType> | SF<TType>;
export type RegisterListArguments<Services, TType> = RegisterListArgument<Services, TType>[];

export type ListLike<T> = SetLike<T> | ArrayLike<T> | RegisterLike<T>;

export type InferListArgumentRegisters<T> = {
    [K in keyof T]: T[K] extends ListLike<infer TType> ? RegisterWithListArguments<T, TType> : unknown;
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

export function isListLike<T>(regiser: unknown): regiser is ListLike<T> {
    return isObjectLike(regiser) && isSetLike(regiser as any) || isArrayLike(regiser as any) || isRegisterLike(regiser as any);
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

export type RegisterWithListArguments<T, TType> = (...items: RegisterListArguments<T, TType>) => {};

export const getServices = <Services, T>(getService: ServiceFactoryByTag<T>, ...items: RegisterListArguments<Services, T>): SF<T>[] =>
    map(
        cond([
            [isServiceFactory, identity],
            [isServiceTag, getService],
        ]),
        items,
    );

export function registerList<Services, T>(container: ServiceFunctionReferenceContainerInterface, registry: ServiceTag, ...items: RegisterListArguments<Services, T>): void {
    const serverFactories = getServices<Services, T>(container.getService, ...items);
    container.override(new Override<ArrayLike<T>>({
        tag: registry,
        override: (parent) => {
            let arrayLike: ListLike<T> = parent();
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
                    throw new Error("Expected ListLike object, not " + arrayLike)
                }
                if (isListLike(result)) {
                    arrayLike = result;
                }
            }
            return arrayLike as any;
        },
    }));
}
