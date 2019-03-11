import { AbstractFunctionLogger } from '../AbstractFunctionLogger';
import { LogLevel } from '../LoggerInterface';

it('Should call the correct log function', () => {

  class MyLogger extends AbstractFunctionLogger {
    public trace = jest.fn();
    public info = jest.fn();
    public warn = jest.fn();
    public debug = jest.fn();
    public error = jest.fn();
  }

  const logger = new MyLogger();

  logger.log(LogLevel.trace, 'test trace', 0);
  expect(logger.trace).toBeCalledWith('test trace', 0);

  logger.log(LogLevel.info, 'test info', 1);
  expect(logger.info).toBeCalledWith('test info', 1);

  logger.log(LogLevel.warn, 'test warning', 2);
  expect(logger.warn).toBeCalledWith('test warning', 2);

  logger.log(LogLevel.debug, 'test debug', 3);
  expect(logger.debug).toBeCalledWith('test debug', 3);

  logger.log(LogLevel.error, 'test error', 4);
  expect(logger.error).toBeCalledWith('test error', 4);
});

it('Throws exception when log level does not exists', () => {

  class MyLogger extends AbstractFunctionLogger {
    public trace = jest.fn();
    public info = jest.fn();
    public warn = jest.fn();
    public debug = jest.fn();
    public error = jest.fn();
  }

  const logger = new MyLogger();

  expect(() => {
    logger.log(100, 'test');
  }).toThrow('Log level "100" not supported');
});
