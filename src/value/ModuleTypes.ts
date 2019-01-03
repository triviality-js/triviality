/**
 * @file
 *
 * Moved Module types to this file instead of Module.ts, so users won't be distracted of complex types they don't need to use.
 */

import { NoDuplicates, Omit, PromiseType } from '../util/Types';
import { Module } from '../Module';
import { HasRegistries, RegistriesMap } from './Registry';

export const ModuleExcludes: Array<keyof Module> = [('container') as any, 'registries', 'setup', 'serviceOverrides'];

/**
 * Define type with all registries as optional and allow new registries to be defined.
 */
export type ModuleOptionalRegistries<C, R> = Module<C, R & RegistriesMap>;

/**
 * Module constructor with type guard it never return a duplicate service of the container.
 */
export type ModuleConstructor<T, Container, Registries> = new (container: Container & HasRegistries<Registries>) => T & NoDuplicates<Container>;

/**
 * Only return the module service types.
 */
export type ModuleServices<T extends Module> = T extends { container: any } ? Omit<T, 'container' | 'registries' | 'setup' | 'serviceOverrides'> : Omit<T, 'registries' | 'setup' | 'serviceOverrides'>;

/**
 * Return type of module registries.
 */
export type ModuleRegistries<T extends Module> = T extends HasRegistries<{}> ? PromiseType<ReturnType<NonNullable<T['registries']>>> : {};

/**
 * Module can be null. {@see ModuleServices}
 */
export type OptionalModuleServices<T extends (null | Module)> = T extends null ? {} : ModuleServices<NonNullable<T>>;

/**
 * Module can be null. {@see ModuleRegistries}
 */
export type OptionalModuleRegistries<T extends (null | Module)> = T extends null ? {} : ModuleRegistries<NonNullable<T>>;
