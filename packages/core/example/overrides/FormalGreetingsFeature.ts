import { FF, SF } from '../../src';
import { FormalGreetingsService } from './services/FormalGreetingsService';
import { GreetingsServiceInterface } from './services/GreetingsServiceInterface';

interface FormalGreetingsFeatureServices {
  greetingService: SF<GreetingsServiceInterface>;
  formalGreetingsService: SF<GreetingsServiceInterface>;
}

export const FormalGreetingsFeature: FF<FormalGreetingsFeatureServices, {}> = ({ overrideWith, construct }) => ({

  greetingService: overrideWith('formalGreetingsService'),

  formalGreetingsService: construct(FormalGreetingsService),
});
