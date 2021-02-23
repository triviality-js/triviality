import { LoggerInterface } from '../features/LoggerInterface';
import { HalloService } from './HalloService';
import {FF} from "@triviality/core";

export interface HalloFeatureServices {
  halloServiceFactory: (name: string) => HalloService;
}

export interface HalloFeatureDependencies {
  logger: LoggerInterface;
}

export const HalloFeature: FF<HalloFeatureServices, HalloFeatureDependencies> = ({ dependencies }) => ({
  halloServiceFactory: () => (name: string) => new HalloService(dependencies.logger(), name),
});
