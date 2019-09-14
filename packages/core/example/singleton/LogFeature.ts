import { FeatureFactory, SF } from '../../src/types';
import { LoggerInterface } from '../features/LoggerInterface';
import { PrefixedLogger } from './PrefixedLogger';

export const createConsoleLogger: SF<LoggerInterface> = (): LoggerInterface => {
  return console;
};

export const createPrefixedLogger = (logger: LoggerInterface) => (prefix: string): LoggerInterface => {
  return new PrefixedLogger(logger, prefix);
};

export interface LogFeatureInstance {
  logger: SF<LoggerInterface>;
  prefixedLogger: SF<(name: string) => LoggerInterface>;
}

export const LogFeature: FeatureFactory<LogFeatureInstance> = ({ inject }) => ({
  logger: createConsoleLogger,
  prefixedLogger: inject('logger', createPrefixedLogger),
});
