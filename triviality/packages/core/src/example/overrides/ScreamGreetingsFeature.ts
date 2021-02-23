import { FF } from '@triviality/core';
import { GreetingsServiceInterface } from './services/GreetingsServiceInterface';
import { ScreamGreetingsService } from './services/ScreamGreetingsService';
import { GreetingsFeatureServices } from './GreetingsFeature';

function decorateWithScreams(greeter: GreetingsServiceInterface): GreetingsServiceInterface {
  return new ScreamGreetingsService(greeter);
}

export const ScreamGreetingsFeature: FF<{ }, GreetingsFeatureServices> = ({ override, construct }) => ({
    ...override('greetingService', construct(ScreamGreetingsService)),
});
