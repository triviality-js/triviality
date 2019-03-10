import { Feature, OptionalContainer } from '../../src';
import { GreetingsFeature } from './GreetingsFeature';
import { FormalGreetingsService } from './services/FormalGreetingsService';
import { GreetingsServiceInterface } from './services/GreetingsServiceInterface';

export class FormalGreetingsFeature implements Feature {
  public serviceOverrides(): OptionalContainer<GreetingsFeature> {
    return {
      greetingService: () => this.formalGreetingsService(),
    };
  }

  public formalGreetingsService(): GreetingsServiceInterface {
    return new FormalGreetingsService();
  }

}
