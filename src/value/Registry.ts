import { ContainerError } from '../ContainerError';

export type RegistryValues = any[] | { [key: string]: any };
export type Registry = () => RegistryValues;

export interface Registries {
}

export interface RegistriesMap {
  [registry: string]: Registry;
}

export function mergeRegistries(combined: { [name: string]: Registry[] }, registries: RegistriesMap): { [name: string]: Registry[] } {
  Object.keys(registries).forEach((name: string) => {
    if (!combined[name]) {
      combined[name] = [];
    }
    const registry = registries[name];
    combined[name].push(registry);
  });
  return combined;
}

export function mergeRegistryValues(registers: RegistryValues[]): RegistryValues {
  let combined: RegistryValues | null = null;
  for (const registry of registers) {
    if (combined === null) {
      if (registry instanceof Array) {
        combined = [].concat(...registry as any);
      } else if (registry instanceof Object) {
        combined = Object.assign({}, registry);
      } else {
        throw ContainerError.wrongRegisterReturnType();
      }
    } else {
      if (combined instanceof Array) {
        if (!(registry instanceof Array)) {
          throw ContainerError.registerShouldAllReturnSameType();
        }
        combined = combined.concat(...registry as any);
      } else {
        if (registry instanceof Array || !registry) {
          throw ContainerError.registerShouldAllReturnSameType();
        }
        combined = Object.assign(combined, registry);
      }
    }
  }
  if (combined === null) {
    throw ContainerError.wrongRegisterReturnType();
  }
  return combined;
}
