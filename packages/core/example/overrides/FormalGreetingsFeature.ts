import { FF } from '../../src';
import { FormalGreetingsService } from './services/FormalGreetingsService';
import { GreetingsServiceInterface } from './services/GreetingsServiceInterface';
import { GreetingsFeatureServices } from './GreetingsFeature';

interface FormalGreetingsFeatureServices {
  formalGreetingsService: GreetingsServiceInterface;
}

export const FormalGreetingsFeature: FF<FormalGreetingsFeatureServices, GreetingsFeatureServices> = ({ override: { greetingService }, service, construct }) => ({

  ...greetingService(service('formalGreetingsService')),

  formalGreetingsService: construct(FormalGreetingsService),
});
