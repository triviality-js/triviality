import { FF } from '../../src';
import { LoggerInterface } from './LoggerInterface';
import { ConsoleLogger } from './ConsoleLogger';

export interface LogServices {
  logger: LoggerInterface;
}

export const LogFeature: FF<LogServices> = () => ({
  logger: () => new ConsoleLogger(),
});
