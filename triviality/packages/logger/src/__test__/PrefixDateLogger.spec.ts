import { PrefixDateLogger } from '../PrefixDateLogger';
import { JestTestLogger } from '../JestTestLogger';
import {Moment} from "moment";

it('Should add date prefix', () => {

  const momentMock = {
    format: jest.fn().mockReturnValue('12/27/2018 11:15:53 AM'),
  };

  const testLogger = new JestTestLogger();
  const logger = new PrefixDateLogger(testLogger, undefined, undefined, () => momentMock as unknown as Moment);

  logger.info('Test', 1);

  expect(testLogger.info).toBeCalledWith('12/27/2018 11:15:53 AM:Test', 1);
  expect(momentMock.format).toBeCalledWith('L LTS');
});

it('Can add different date prefix', () => {

  const momentMock = {
    format: jest.fn().mockReturnValue('11:15:53 AM'),
  };

  const testLogger = new JestTestLogger();
  const logger = new PrefixDateLogger(testLogger, 'LTS', undefined, () => momentMock as unknown as Moment);

  logger.info('Test');

  expect(testLogger.info).toBeCalledWith('11:15:53 AM:Test');
  expect(momentMock.format).toBeCalledWith('LTS');
});

it('Can use a different separator', () => {

  const momentMock = {
    format: jest.fn().mockReturnValue('12/27/2018 11:15:53 AM'),
  };

  const testLogger = new JestTestLogger();
  const logger = new PrefixDateLogger(testLogger, undefined, ' --> ', () => momentMock as unknown as Moment);

  logger.info('Test');

  expect(testLogger.info).toBeCalledWith('12/27/2018 11:15:53 AM --> Test');
  expect(momentMock.format).toBeCalledWith('L LTS');
});
