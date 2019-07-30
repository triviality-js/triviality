import { ServiceFunction } from '../../src';
import { HalloService } from '../featureDependency/HalloService';
import { LoggerInterface } from '../features/LoggerInterface';

export const createHalloService = (logger: ServiceFunction<LoggerInterface>) => (name: string): HalloService => {
  return new HalloService(logger(), name);
};

export const HalloFeature = ({ logger }: { logger: ServiceFunction<LoggerInterface> }) => ({
  halloService: createHalloService(logger),
});
