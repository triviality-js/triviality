import { Container, Feature, Optional } from '../../src';
import { ScreamGreetingsService } from './services/ScreamGreetingsService';
import { GreetingsFeature } from './GreetingsFeature';

export class ScreamGreetingsFeature implements Feature {
  public serviceOverrides(container: Container<GreetingsFeature>): Optional<Container<GreetingsFeature>> {
    return {
      greetingService: () => new ScreamGreetingsService(container.greetingService()),
    };
  }

}
