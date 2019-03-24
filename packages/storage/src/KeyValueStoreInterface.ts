
export interface KeyValueStoreInterface<T, K = string> {

  find(key: K): T | null;

  /**
   * Throws exception when there is no value.
   */
  get(key: K): T;

  has(key: K): boolean;

  set(key: K, value: T): void;

  clear(): void;

  delete(key: K): void;
}
