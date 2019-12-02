export const once = <T extends () => R, R>(fn: T): () => R => {
  let called = false;
  let result: R;
  return (...args: any[]) => {
    if (called) {
      return result;
    }
    // @ts-ignore
    result = (fn as any).apply(this, args);
    called = true;
    return result;
  };
};
