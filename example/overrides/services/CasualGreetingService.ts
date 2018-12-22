import { GreetingsServiceInterface } from './GreetingsServiceInterface';

export class CasualGreetingService implements GreetingsServiceInterface {
  public greet(name: string): string {
    return `Hallo ${name}`;
  }

}
