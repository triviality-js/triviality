import { AbstractLogLevelLogger } from './AbstractLogLevelLogger';

export class NullLogger extends AbstractLogLevelLogger {
  public log(): void {
    // Log nothing.
  }
}
