/**
 * Return all functions/properties including base classes.
 */
export function getAllPropertyNames(object: any): string[] {
  const methods: string[] = [];
  let obj = object;
  const plain = {};
  while (obj) {
    const keys = Object.getOwnPropertyNames(obj);
    keys
      .forEach((k) => {
        if (typeof (plain as any)[k] !== 'undefined') {
          return;
        }
        methods.push(k);
      });
    obj = Object.getPrototypeOf(obj);
  }
  return methods;
}
