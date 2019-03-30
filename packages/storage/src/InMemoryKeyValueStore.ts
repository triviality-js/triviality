import { MapKeyValueStore } from './MapKeyValueStore';

export class InMemoryKeyValueStore<T, K = string> extends MapKeyValueStore<T, K> {

}

export function inMemory<T, K = string>() {
  return new InMemoryKeyValueStore<T, K>();
}
