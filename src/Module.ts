import { Registries } from './Registry';
import { NoDuplicates, Omit } from './util/Types';

export interface Module<R extends Registries = {}> {
  [key: string]: any;

  setup?(): void;

  registries?(): R;
}

export type ModuleConstructor<Instance, C> = new (container: C) => Instance & NoDuplicates<C>;

export type StrippedModule<T extends Module> = Omit<T, 'container' | 'registries' | 'setup'>;

export type ModuleRegistries<T extends Module> = T['registries'] extends undefined ? {} : ReturnType<NonNullable<T['registries']>>;
