/**
 * Context helper for using async services.
 */
import { SF } from '../ServiceFactory';
import {wrapReturnAsServiceFactoryReference} from "../ServiceFactoryReference";
import {RegistryContext} from "./RegistryContext";

export interface AsyncContext {
  /**
   * Convert async service factory to sync service factory.
   */
  synchronize<T>(sf: () => Promise<T>): SF<T>;
}

export interface AsyncContextFeatureServices {
  asyncFeatureFactories: Array<() => Promise<void>>;
}

export const createFeatureFactoryAsyncContext = ({ registers: {asyncFeatureFactories} }: RegistryContext<AsyncContextFeatureServices>): AsyncContext => {
  return ({
    synchronize: wrapReturnAsServiceFactoryReference(<T extends SF>(sf: () => Promise<T>): T => {





    }),
  });
};
