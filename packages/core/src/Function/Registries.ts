import { filter } from 'ramda';
import { ContainerError } from '..';
import { REGISTER_SYMBOL, RegistryValues } from '../types';

export const isRegistryService = (value: unknown) => typeof value === 'function' && (value as any)[REGISTER_SYMBOL];

export const registryServices = filter(isRegistryService);

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
