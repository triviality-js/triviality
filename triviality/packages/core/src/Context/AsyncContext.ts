/**
 * Context helper for using async services.
 */
import {asServiceFactoryReference} from "../serviceReferenceFactoryInterface";
import {AsyncError} from "../Error";
import {GlobalInvokeStack} from "../GlobalInvokeStack";
import { SF } from "../Value";

export interface AsyncContext {
  /**
   * Convert async service factory to sync service factory.
   */
  synchronize<T>(sf: () => Promise<T>): SF<T>;
}

export const createFeatureFactoryAsyncContext = (): AsyncContext => {
  return ({
    synchronize: <T>(asyncSf: () => Promise<T>): SF<T> => {
      let promise: Promise<void> | null = null;
      let resolved = false;
      let result: T | undefined;
      const executePromise = (): Promise<void> => {
        if (resolved) {
          return Promise.resolve();
        }
        if (promise === null) {
          promise = asyncSf().then((r: T) => {
            resolved = true;
            result = r;
          }).catch((e) => {
            promise = null;
            return Promise.reject(e);
          });
        }
        return promise;
      };

      GlobalInvokeStack.addCompilerPass(executePromise);

      return asServiceFactoryReference<T>(() => {
        if (resolved) {
          return result as T;
        }
        throw new AsyncError(executePromise(), executePromise);
      });
    }
  });
};
