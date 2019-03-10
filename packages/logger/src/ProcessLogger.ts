import { LoggerInterface, LogLevel } from './LoggerInterface';
import { AbstractLogLevelLogger } from './AbstractLogLevelLogger';
import * as os from 'os';
import * as util from 'util';
import Process = NodeJS.Process;

/**
 * With format option like console. Handy if you want to control eol.
 *
 * https://nodejs.org/api/util.html#util_util_format_format_args
 */
export class ProcessLogger extends AbstractLogLevelLogger implements LoggerInterface {

  constructor(private readonly process: Process, private eol = os.EOL) {
    super();
  }

  public log(type: LogLevel, message?: any, ...optionalParams: any[]): void {
    if (type === LogLevel.error) {
      this.process.stderr.write(util.format(message, ...optionalParams) + this.eol);
      return;
    }
    this.process.stdout.write(util.format(message, ...optionalParams) + this.eol);
  }

}
