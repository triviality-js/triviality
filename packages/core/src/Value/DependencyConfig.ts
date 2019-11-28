import { FF } from '../FeatureFactory';

export interface DependencyConfig {
  name?: string;
  factory: FF;
  arguments: DependencyConfig[];
}

export interface OverrideConfig {
  name: string;
  with: DependencyConfig;
}

export interface ContainerConfig {
  dependencies: DependencyConfig[];
  overrides: OverrideConfig[];
}
