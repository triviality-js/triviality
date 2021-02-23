/**
 * Trivially is mainly synchronous.
 *
 * In compile step all async function will be resolved. Because of conflicts
 * function that are not async can throw an AsyncError if the try to use something asynchronous
 * within retryUntilNoAsyncErrors everything will be called again until all async errors are resolved.
 */
import {GlobalInvokeStack} from "../GlobalInvokeStack";

export class AsyncError extends Error {
  constructor(public readonly pending: Promise<void>, public readonly retry: () => Promise<void>) {
    super('Asynchronous function should be resoled inside ServiceContainerFactory\n' + GlobalInvokeStack.printStack());
    Object.setPrototypeOf(this, AsyncError.prototype);
    this.name = this.constructor.name;
  }
}

/**
 * Catches async error, and try to resolve the promise.
 */
export const handleAsyncError = async (e: unknown): Promise<void> => {
  if (e instanceof AsyncError) {
    await e.pending.catch(handleAsyncError);
    return await retryUntilNoAsyncErrors(e.retry);
  }
  return Promise.reject(e);
};

/**
 * This function will be called during compile time. Retry everything until all async service functions are resolved.
 */
export const retryUntilNoAsyncErrors = async <A extends unknown[]>(callback: (...args: A) => Promise<void>, ...args: A) => {
  let retry = false;
  do {
    retry = false;
    try {
      await callback(...args);
    } catch (e) {
      retry = true;
      await handleAsyncError(e);
    }
  } while (retry);
}
