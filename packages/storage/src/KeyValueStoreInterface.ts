export interface KeyValueStoreInterface<T, K = string> {

  find(key: K, defaultValue?: T | null): T | null;

  /**
   * Throws exception when there is no value.
   */
  get(key: K): T;

  has(key: K): boolean;

  set(key: K, value: T): this;

  clear(): this;

  delete(key: K): this;
}
