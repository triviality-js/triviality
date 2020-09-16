import { FF } from '../../FeatureFactory';
import { KernelServices } from '../KernelFeature';
import { drawDependencies } from './drawDependency';

export interface DebugFeatureServices {
  getDependencyTree(): string;
}

export const TextDebugFeature: FF<DebugFeatureServices, KernelServices> = function textDebugFeature({ compose }) {
  return {
    getDependencyTree: compose((kernel) => () => drawDependencies(kernel.references()), 'kernel'),
  };
};
