import { AbstractLogLevelLogger } from '../AbstractLogLevelLogger';
import { LogLevel } from '../LoggerInterface';

it('should pass the correct LogLevel to the abstract log function', () => {

  const spy = jest.fn();

  class MyLogger extends AbstractLogLevelLogger {
    public log(type: LogLevel, ...message: any[]): void {
      spy(type, ...message);
    }

  }

  const logger = new MyLogger();

  logger.trace('test trace', 0);
  expect(spy).toBeCalledWith(LogLevel.trace, 'test trace', 0);

  logger.info('test info', 1);
  expect(spy).toBeCalledWith(LogLevel.info, 'test info', 1);

  logger.warn('test warning', 2);
  expect(spy).toBeCalledWith(LogLevel.warn, 'test warning', 2);

  logger.debug('test debug', 3);
  expect(spy).toBeCalledWith(LogLevel.debug, 'test debug', 3);

  logger.error('test error', 4);
  expect(spy).toBeCalledWith(LogLevel.error, 'test error', 4);
});
