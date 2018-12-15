import { Registries } from './Registry';
import { NoDuplicates, Omit, Optional } from './util/Types';

export interface Module<R extends Registries = {}> {

  toString(): string;

  /**
   * After the hole container is build.
   */
  setup?(): void | Promise<void>;

  /**
   * Registries, result will be combined into one array or object.
   *
   * @example
   *
   *   public registries() {
   *     return {
   *       consoleCommands: (): ConsoleCommand[] => {
   *         return [this.halloConsoleCommand()];
   *       },
   *     };
   *   }
   *
   *   or
   *
   *   public registries() {
   *     return {
   *       consoleCommands: (): ConsoleCommand[] => {
   *         return {
   *            hallo: this.halloConsoleCommand(),
   *         };
   *       },
   *     };
   *   }
   */
  registries?(): R;
}

export type ModuleOptionalRegistries<R> = Module<Optional<R>>;

export type ModuleConstructor<Instance, C> = new (container: C) => Instance & NoDuplicates<C>;

export type StrippedModule<T extends Module> = T extends { container: any } ? Omit<T, 'container' | 'registries' | 'setup'> : Omit<T, 'registries' | 'setup'>;

export type ModuleRegistries<T extends Module<R>, R = {}> = T extends { registries(): R; } ? ReturnType<NonNullable<T['registries']>> : {};

export type ModuleDependency<T extends Module<R>, R = {}> = ModuleRegistries<T, R> & StrippedModule<T>;
