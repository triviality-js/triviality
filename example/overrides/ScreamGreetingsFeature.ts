import { Container, Feature, OptionalContainer } from '../../src';
import { ScreamGreetingsService } from './services/ScreamGreetingsService';
import { GreetingsFeature } from './GreetingsFeature';

export class ScreamGreetingsFeature implements Feature {
  public serviceOverrides(container: Container<GreetingsFeature>): OptionalContainer<GreetingsFeature> {
    return {
      greetingService: () => new ScreamGreetingsService(container.greetingService()),
    };
  }

}
