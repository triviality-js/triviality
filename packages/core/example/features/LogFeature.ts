import { construct } from 'ramda';
import { SF } from '../../src';
import { ConsoleLogger } from './ConsoleLogger';
import { LoggerInterface } from './LoggerInterface';

const createLogger: SF<LoggerInterface> = construct(ConsoleLogger);

export const LogFeature = () => ({
  logger: createLogger,
});
