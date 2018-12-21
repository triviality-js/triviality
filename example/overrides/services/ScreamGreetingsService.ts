import { GreetingsServiceInterface } from './GreetingsServiceInterface';

export class ScreamGreetingsService implements GreetingsServiceInterface {

  constructor(private speakService: GreetingsServiceInterface) {

  }

  public greet(name: string): string {
    return `${this.speakService.greet(name).toUpperCase()}!!!!!!`;
  }

}
