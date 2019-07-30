interface CacheMap {
  args: any[];
  maps: CacheMap[];
  hasValue?: boolean;
  value?: any;
}

/**
 * memorize with support for multiple arguments.
 */
export function memorize<T extends (...args: any[]) => any>(func: T): T {
  if (typeof func !== 'function') {
    throw new Error('Not a function');
  }
  const cache: CacheMap = {
    args: [],
    maps: [],
  };
  return ((...args: any[]) => {
    const length = args.length;
    let current = cache;
    for (let i = 0; i < length; i += 1) {
      const value = args[i];
      const index = current.args.indexOf(value);
      if (index < 0) {
        current.args.push(value);
        const map = {
          args: [],
          maps: [],
        };
        current.maps.push(map);
        current = map;
      } else {
        current = current.maps[index];
      }
    }
    if (current.hasValue) {
      return current.value;
    }
    current.value = func(...args);
    current.hasValue = true;
    return current.value;
  }) as any;
}
