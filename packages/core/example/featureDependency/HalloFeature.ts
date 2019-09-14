import { FF, SF } from '../../src';
import { LoggerInterface } from '../features/LoggerInterface';
import { HalloService } from './HalloService';

export interface HalloFeatureServices {
  halloServiceFactory: SF<(name: string) => HalloService>;
}

export interface HalloFeatureDependencies {
  logger: SF<LoggerInterface>;
}

export const HalloFeature: FF<HalloFeatureServices, HalloFeatureDependencies> = ({ logger }) => ({
  halloServiceFactory: () => (name: string) => new HalloService(logger(), name),
});
