import { LoggerInterface } from './LoggerInterface';
import { AbstractFunctionLogger } from './AbstractFunctionLogger';

export class JestTestLogger extends AbstractFunctionLogger implements LoggerInterface {

  public trace = jest.fn();
  public info = jest.fn();
  public warn = jest.fn();
  public debug = jest.fn();
  public error = jest.fn();

  public mockReset() {
    this.trace.mockReset();
    this.info.mockReset();
    this.warn.mockReset();
    this.debug.mockReset();
    this.error.mockReset();
  }

}
