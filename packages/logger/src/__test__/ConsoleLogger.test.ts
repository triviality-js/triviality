import { ConsoleLogger } from '../ConsoleLogger';
import { JestTestLogger } from '../JestTestLogger';

it('should pass log message to console logger', () => {

  const console: Console = new JestTestLogger() as any;

  const logger = new ConsoleLogger(console);

  /* tslint:disable:no-console */
  logger.trace('test trace', 0);
  expect(console.trace).toBeCalledWith('test trace', 0);

  logger.info('test info', 1);
  expect(console.info).toBeCalledWith('test info', 1);

  logger.warn('test warning', 2);
  expect(console.warn).toBeCalledWith('test warning', 2);

  logger.debug('test debug', 3);
  expect(console.debug).toBeCalledWith('test debug', 3);

  logger.error('test error', 4);
  expect(console.error).toBeCalledWith('test error', 4);
});
