import { Registries } from './Registry';
import { NoDuplicates, Omit, Optional } from './util/Types';

export interface Module<R extends Registries = {}> {

  toString(): string;

  setup?(): void;

  registries?(): R;
}

export type ModuleOptionalRegistries<R> = Module<Optional<R>>;

export type ModuleConstructor<Instance, C> = new (container: C) => Instance & NoDuplicates<C>;

export type StrippedModule<T extends Module> = T extends { container: any } ? Omit<T, 'container' | 'registries' | 'setup'> : Omit<T, 'registries' | 'setup'>;

export type ModuleRegistries<T extends Module<R>, R = {}> = T extends { registries(): R; } ? ReturnType<NonNullable<T['registries']>> : {};

export type ModuleDependency<T extends Module<R>, R = {}> = ModuleRegistries<T, R> & StrippedModule<T>;
