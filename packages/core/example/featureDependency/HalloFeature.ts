import { FF } from '../../src';
import { LoggerInterface } from '../features/LoggerInterface';
import { HalloService } from './HalloService';

export interface HalloFeatureServices {
  halloServiceFactory: (name: string) => HalloService;
}

export interface HalloFeatureDependencies {
  logger: LoggerInterface;
}

export const HalloFeature: FF<HalloFeatureServices, HalloFeatureDependencies> = ({ logger }) => ({
  halloServiceFactory: () => (name: string) => new HalloService(logger(), name),
});
