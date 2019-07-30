import { ServiceContainer } from '../types';
import { Optional, PromiseOrValue } from '../util/Types';

/**
 * @deprecated
 */
export interface Feature<ContainerServices = {}, ContainerRegistries = {}> {
  [key: string]: any;

  toString(): string;

  /**
   * Entry point after the hole container is build. You do your general feature setup logic here.
   */
  setup?(): PromiseOrValue<void>;

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
  registries?(): PromiseOrValue<Optional<ContainerRegistries>>;

  /**
   * The entry hook to override or decorate a service.
   *
   *   public serviceOverrides(container: Container<GreetingsFeature>): Optional<Container<HelloFeature>> {
   *    return {
   *      halloService: () => new MyHalloService(container.halloService()),
   *    };
   *   }
   */
  serviceOverrides?(container: ServiceContainer<ContainerServices, ContainerRegistries, {}>): PromiseOrValue<Optional<ContainerServices>>;
}
