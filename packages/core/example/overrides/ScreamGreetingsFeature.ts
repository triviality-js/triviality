import { SF } from '../../src';
import { GreetingsServiceInterface } from './services/GreetingsServiceInterface';
import { ScreamGreetingsService } from './services/ScreamGreetingsService';

function decorateWithScreams(greeter: GreetingsServiceInterface): GreetingsServiceInterface {
  return new ScreamGreetingsService(greeter);
}

export const ScreamGreetingsFeature = () => ({
  serviceOverrides(container: { greetingService: SF<GreetingsServiceInterface> }) {
    return {
      greetingService: () => decorateWithScreams(container.greetingService()),
    };
  },
});
