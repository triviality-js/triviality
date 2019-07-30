import { Feature } from '../../src';
import { FormalGreetingsService } from '../overrides/services/FormalGreetingsService';
import { GreetingsServiceInterface } from '../overrides/services/GreetingsServiceInterface';

export const FormalGreetingsFeature = (): Feature => ({
  serviceOverrides(): { greetingService(): GreetingsServiceInterface } {
    return {
      greetingService: () => this.formalGreetingsService(),
    };
  },

  formalGreetingsService(): GreetingsServiceInterface {
    return new FormalGreetingsService();
  },
});
