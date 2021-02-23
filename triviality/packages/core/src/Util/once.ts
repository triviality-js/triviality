import {createNamedFunction} from "./createNamedFunction";

export const once = <T extends () => R, R>(fn: T, name?: string): () => R => {
  let called = false;
  let hasResult = false;
  let result: R;
  return createNamedFunction(  `${name ?? fn.name}Cached`, function (this: unknown) {
    if (called) {
      if (hasResult) {
        return result;
      }
      throw new Error('Recursion error');
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
