import { BuildContext, BuildStep } from './BuildStep';
import { ContainerError, Registry, RegistryValues } from '..';
import { getAllPropertyNames } from '../util/getAllPropertyNames';
import { memorize } from '../util/memorize';
import { FeatureDependencyCollection } from '../Value/FeatureDependencyCollection';

export class MergeRegistries<Services, Registries> implements BuildStep<Services, Registries> {

  public async build(context: BuildContext<Services, Registries>): Promise<void> {
    const { container, features } = context;
    const registries = await this.getRegistries(features);
    container.defineRegistries(() => registries);
    for (const feature of features.withRegistries().toArray()) {
      feature.defineProperty(container, 'registries');
    }
  }

  public async getRegistries(feature: FeatureDependencyCollection): Promise<{ [name: string]: Registry }> {
    const combined: { [name: string]: Registry[] } = await feature.getFeatureRegistries();
    const registries: { [name: string]: Registry } = {};
    getAllPropertyNames(combined).forEach((register) => {
      const registerCached = memorize(() => {
        const featureRegistries = combined[register];
        const services = featureRegistries.map((reg) => reg());
        return mergeRegistryValues(services);
      });
      Object.defineProperty(registries, register, { get: () => registerCached, set: ContainerError.throwIsLocked });
    });
    return registries;
  }

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
