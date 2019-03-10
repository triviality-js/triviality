import { FromLogLevelLogger } from '../FromLogLevelLogger';
import { JestTestLogger } from '../JestTestLogger';
import { LogLevel } from '../LoggerInterface';

it('From level logger', () => {

  const testLogger = new JestTestLogger();
  const logger = new FromLogLevelLogger(testLogger, LogLevel.warn);

  logger.trace('test trace');
  expect(testLogger.trace).not.toBeCalled();

  logger.debug('test debug');
  expect(testLogger.debug).not.toBeCalled();

  logger.info('test info');
  expect(testLogger.info).not.toBeCalled();

  logger.warn('test warn');
  expect(testLogger.warn).toBeCalledWith('test warn');

  logger.error('test error');
  expect(testLogger.error).toBeCalledWith('test error');

});

it('Should pass optionalParams', () => {

  const testLogger = new JestTestLogger();
  const logger = new FromLogLevelLogger(testLogger, LogLevel.warn);

  logger.warn('test warn', 1);
  expect(testLogger.warn).toBeCalledWith('test warn', 1);

  logger.error('test error', 2);
  expect(testLogger.error).toBeCalledWith('test error', 2);

});
