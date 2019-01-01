/**
 * @file
 *
 * Moved Module types to this file instead of Module.ts, so users won't be distracted of complex types they don't need to use.
 */

import { NoDuplicates, Omit, Optional, PromiseType } from '../util/Types';
import { Module } from '../Module';
import { RegistriesMap } from './Registry';

export type ModuleOptionalRegistries<R, C> = Module<Optional<R> & RegistriesMap, C>;

export type ModuleConstructor<Instance, Requirements> = new (container: Requirements) => Instance & NoDuplicates<Requirements>;

export const ModuleExcludes: Array<keyof Module<{}, {}>> = [('container') as any, 'registries', 'setup', 'serviceOverrides'];

export type StrippedModule<T extends Module> = T extends { container: any } ? Omit<T, 'container' | 'registries' | 'setup' | 'serviceOverrides'> : Omit<T, 'registries' | 'setup' | 'serviceOverrides'>;

export type ModuleRegistries<T extends Module<R>, R = {}> = T extends { registries(): R; } ? PromiseType<ReturnType<NonNullable<T['registries']>>> : {};

export type ModuleDependency<T extends Module<R>, R = {}> = ModuleRegistries<T, R> & StrippedModule<T>;

export type OptionalModuleDependency<T extends (null | Module<R>), R = {}> = T extends null ? {} : ModuleDependency<NonNullable<T>, R>;
