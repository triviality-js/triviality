import { GreetingsServiceInterface } from './GreetingsServiceInterface';

export class FormalGreetingsService implements GreetingsServiceInterface {
  public greet(name: string): string {
    return `Pleased to meet you ${name}`;
  }

}
