import { JestTestLogger } from '../JestTestLogger';
import { PrefixLogger } from '../PrefixLogger';

it('Should add prefix', () => {

  const testLogger = new JestTestLogger();
  const logger = new PrefixLogger(testLogger, 'Hallo:');

  logger.trace('test trace', 1);
  expect(testLogger.trace).toBeCalledWith('Hallo:test trace', 1);

});

it('Should add prefix from static constructor', () => {

  const testLogger = new JestTestLogger();
  const logger = PrefixLogger.with(testLogger, 'Hallo:');

  logger.trace('test trace', 2);
  expect(testLogger.trace).toBeCalledWith('Hallo:test trace', 2);

});
