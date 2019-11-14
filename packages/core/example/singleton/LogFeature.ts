import { LoggerInterface } from '../features/LoggerInterface';
import { PrefixedLogger } from './PrefixedLogger';
import { FF, SF } from '../../src';
import { ConsoleLogger } from '../features/ConsoleLogger';

export const createPrefixedLogger = (logger: LoggerInterface) => (prefix: string): LoggerInterface => {
  return new PrefixedLogger(logger, prefix);
};

export interface LogFeatureInstance {
  logger: SF<LoggerInterface>;
  prefixedLogger: SF<(name: string) => LoggerInterface>;
}

export const LogFeature: FF<LogFeatureInstance> = ({ services }) => ({
  logger: () => new ConsoleLogger(),
  prefixedLogger: () => createPrefixedLogger(services('logger').logger()),
});
