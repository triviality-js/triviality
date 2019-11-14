import { CasualGreetingService } from './services/CasualGreetingService';
import { GreetingsServiceInterface } from './services/GreetingsServiceInterface';
import { FF, SF } from '../../src';

export function greetingService() {
  return new CasualGreetingService();
}

export interface GreetingsFeatureServices {
  greetingService: SF<GreetingsServiceInterface>;
}

export const GreetingsFeature: FF<GreetingsFeatureServices> = () => ({
  greetingService,
});
