import { Registries } from './value/Registry';
import { Optional } from './util/Types';

export interface Module<R extends Registries = {}, C = {}> {

  toString(): string;

  /**
   * Entry point after the hole container is build. You can start your general module 'application' here.
   */
  setup?(): void | Promise<void>;

  /**
   * Registries, result will be combined into one array or object.
   *
   * @example
   *
   *
   *   public registries() {
   *     return {
   *
   *       // Register a for an array collection.
   *       consoleCommands: (): ConsoleCommand[] => {
   *         return [this.halloConsoleCommand()];
   *       },
   *
   *       // Register for key->value pairs.
   *       eventListener: (): {[event: string]: EventListener} => {
   *         return {
   *            loginEvent: this.myLoginEventHandler(),
   *         };
   *       },
   *     };
   *   }
   */
  registries?(): R | Promise<R>;

  /**
   * The entry hook to override or decorate a service.
   *
   *   public serviceOverrides(container: Container<GreetingsModule>): Optional<Container<HelloModule>> {
   *    return {
   *      halloService: () => new MyHalloService(container.halloService()),
   *    };
   *   }
   */
  serviceOverrides?(container: C): Optional<C> | Promise<Optional<C>>;
}
