export interface StateStorageInterface<T> {

  get(preloadedState?: T): T | null;

  set(value: T): void;

}
