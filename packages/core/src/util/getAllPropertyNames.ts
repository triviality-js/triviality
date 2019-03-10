
/**
 * Return all functions/properties including base classes.
 */
export function getAllPropertyNames<T extends object>(object: T): Array<Extract<keyof T, string>> {
  const methods: Array<Extract<keyof T, string>> = [];
  let obj = object;
  const plain = {};
  while (obj) {
    const keys = Object.getOwnPropertyNames(obj);
    keys
      .forEach((k) => {
        if (typeof (plain as any)[k] !== 'undefined') {
          return;
        }
        methods.push(k as any);
      });
    obj = Object.getPrototypeOf(obj);
  }
  return methods;
}

/**
 * Return all functions/properties including base classes with values.
 */
export function getAllPropertyValues<T extends object>(object: T): Array<[Extract<keyof T, string>, any]> {
  return getAllPropertyNames(object).map((name) => [name, object[name]]) as any;
}
