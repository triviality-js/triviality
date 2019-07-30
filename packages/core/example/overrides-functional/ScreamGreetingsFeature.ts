import { ServiceFunction } from '../../src';
import { GreetingsServiceInterface } from '../overrides/services/GreetingsServiceInterface';
import { ScreamGreetingsService } from '../overrides/services/ScreamGreetingsService';

function decorateWithScreams(greeter: GreetingsServiceInterface): GreetingsServiceInterface {
  return new ScreamGreetingsService(greeter);
}

export const ScreamGreetingsFeature = () => ({
  serviceOverrides(container: { greetingService: ServiceFunction<GreetingsServiceInterface> }) {
    return {
      greetingService: () => decorateWithScreams(container.greetingService()),
    };
  },
});
