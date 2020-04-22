export const once = <T extends () => R, R>(fn: T): () => R => {
  let called = false;
  let hasResult = false;
  let result: R;
  return function (this: any, ...args: any[]) {
    if (called) {
      if (hasResult) {
        return result;
      }
      throw new Error('Recursion error');
    }
    called = true;
    result = (fn as any).apply(this, args);
    hasResult = true;
    return result;
  };
};
