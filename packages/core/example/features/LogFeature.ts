import { FF, SF } from '../../src';
import { LoggerInterface } from './LoggerInterface';
import { ConsoleLogger } from './ConsoleLogger';

export interface LogServices {
  logger: SF<LoggerInterface>;
}

export const LogFeature: FF<LogServices> = () => ({
  logger: () => new ConsoleLogger(),
});
