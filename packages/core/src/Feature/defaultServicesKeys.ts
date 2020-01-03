import type { KernelServices } from './KernelFeature';
import type { SetupFeatureServices } from './SetupFeature';

export type DefaultServices = (KernelServices & SetupFeatureServices);

export type DefaultServicesKeys = keyof DefaultServices;

export const defaultServiceKeys: DefaultServicesKeys[] = ['dependencyInfo', 'setupCallbacks'];
