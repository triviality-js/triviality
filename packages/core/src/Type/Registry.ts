
export type RegistryValues = any[] | { [key: string]: any };
export type Registry = () => RegistryValues;

export interface RegistriesMap {
  [registry: string]: Registry;
}

export interface HasRegistries<R> {
  registries(): R;
}
