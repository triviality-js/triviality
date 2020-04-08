import { FF } from '../../FeatureFactory';
import { KernelServices } from '../KernelFeature';
import { drawDependencies } from './drawDependency';

export interface DebugFeatureServices {
  getDependencyTree(): string;
}

export const TextDebugFeature: FF<DebugFeatureServices, KernelServices> = function textDebugFeature({ kernel }) {
  return {
    getDependencyTree: () => () => drawDependencies(kernel().references()),
  };
};
