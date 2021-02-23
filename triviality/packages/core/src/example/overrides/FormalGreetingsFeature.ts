import { FF } from '@triviality/core';
import { FormalGreetingsService } from './services/FormalGreetingsService';
import { GreetingsServiceInterface } from './services/GreetingsServiceInterface';
import { GreetingsFeatureServices } from './GreetingsFeature';

interface FormalGreetingsFeatureServices {
  formalGreetingsService: GreetingsServiceInterface;
}

export const FormalGreetingsFeature: FF<FormalGreetingsFeatureServices, GreetingsFeatureServices> = ({ override, compose, construct }) => ({

  ...override('greetingService', 'formalGreetingsService'),

  formalGreetingsService: construct(FormalGreetingsService),
});
