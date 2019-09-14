import { registerList, RegistryList } from './registerList';
import { registerMap, RegistryMap } from './registerMap';

export type Registries<T> = {
  [K in keyof T]: T[K] extends RegistryLike<any> ? T[K] : never;
};

export type RegistryLike<T> = RegistryList<T> | RegistryMap<T>;

export interface FeatureFactoryRegistryContext<T> {

  registerList: typeof registerList;
  registerMap: typeof registerMap;

  registries(): Registries<T>;

}
