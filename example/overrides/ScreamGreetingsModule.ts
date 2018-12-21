import { Container, Module, Optional } from '../../src';
import { ScreamGreetingsService } from './services/ScreamGreetingsService';
import { GreetingsModule } from './GreetingsModule';

export class ScreamGreetingsModule implements Module {
  public serviceOverrides(container: Container<GreetingsModule>): Optional<Container<GreetingsModule>> {
    return {
      greetingService: () => new ScreamGreetingsService(container.greetingService()),
    };
  }

}
