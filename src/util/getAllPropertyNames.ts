/**
 * Return all functions/properties including base classes.
 */
export function getAllPropertyNames(object: any) {
  const methods = new Set();
  let obj = object;
  const plain = {};
  while (obj) {
    const keys = Reflect.ownKeys(obj);
    keys.filter((k) => typeof (plain as any)[k] === 'undefined').forEach((k) => methods.add(k));
    obj = Reflect.getPrototypeOf(obj);
  }
  return methods;
}
