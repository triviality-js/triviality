export interface Registry<T> extends Iterable<T> {
  toArray(): T[];
  (): T[];
}
