import { Container, Module, Optional } from '../../src';
import { GreetingsModule } from './GreetingsModule';
import { FormalGreetingsService } from './services/FormalGreetingsService';
import { GreetingsServiceInterface } from './services/GreetingsServiceInterface';

export class FormalGreetingsModule implements Module {
  public serviceOverrides(): Optional<Container<GreetingsModule>> {
    return {
      greetingService: () => this.formalGreetingsService(),
    };
  }

  public formalGreetingsService(): GreetingsServiceInterface {
    return new FormalGreetingsService();
  }

}
