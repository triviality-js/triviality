import { Module } from '../../src';
import { GreetingsServiceInterface } from './services/GreetingsServiceInterface';
import { CasualGreetingService } from './services/CasualGreetingService';

export class GreetingsModule implements Module {

  public greetingService(): GreetingsServiceInterface {
    return new CasualGreetingService();
  }

}
