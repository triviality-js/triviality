import { Feature } from '../../src';
import { GreetingsServiceInterface } from './services/GreetingsServiceInterface';
import { CasualGreetingService } from './services/CasualGreetingService';

export class GreetingsFeature implements Feature {

  public greetingService(): GreetingsServiceInterface {
    return new CasualGreetingService();
  }

}
