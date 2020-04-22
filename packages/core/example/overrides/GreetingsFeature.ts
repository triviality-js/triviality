import { CasualGreetingService } from './services/CasualGreetingService';
import { GreetingsServiceInterface } from './services/GreetingsServiceInterface';
import { FF } from '../../src';

export interface GreetingsFeatureServices {
  greetingService: GreetingsServiceInterface;
}

export const GreetingsFeature: FF<GreetingsFeatureServices> = () => ({
  greetingService: () => new CasualGreetingService(),
});
