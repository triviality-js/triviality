import { LoggerInterface } from './LoggerInterface';

export class ConsoleLogger implements LoggerInterface {
  constructor(private _console: Console = console) {
  }
  public info(...message: string[]): void {
    this._console.info(...message);
  }
}
