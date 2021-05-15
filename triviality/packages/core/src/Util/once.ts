import {createNamedFunction} from "./createNamedFunction";
import {ContainerError} from "../Error";

export const once = <T extends () => R, R>(fn: T, name: string = fn.name): () => R => {
  let called = false;
  let hasResult = false;
  let result: R;
  return createNamedFunction(  `${name}Cached`, function (this: unknown) {
    if (called) {
      if (hasResult) {
        return result;
      }
      throw new ContainerError('Recursion error');
    }
    called = true;
    try {
      result = (fn).apply(this);
    } catch (e) {
      called = false;
      throw e;
    }
    hasResult = true;
    return result;
  });
};
