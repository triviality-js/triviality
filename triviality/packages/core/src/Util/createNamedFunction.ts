
/**
 * Named function without arguments.
 */
export const createNamedFunction = <R, T extends () => R>(name: string, fn: T): T => {
  const obj = {
    [name]: (): R => {
      return fn();
    }
  };
  return obj[name] as T;
};
