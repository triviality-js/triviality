import { Omit } from './util/Omit';

export interface Module {
  [key: string]: any;

  setup?: () => void | Promise<void>;
}

export type ModuleConstructor<Instance extends Module, C> = new (container: C) => Instance;

export type ModuleWithoutContainer<T extends Module> = Omit<T, 'container'>;
