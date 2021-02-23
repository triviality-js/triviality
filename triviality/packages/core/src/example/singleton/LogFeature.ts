import { LoggerInterface } from '../features/LoggerInterface';
import { PrefixedLogger } from './PrefixedLogger';
import { ConsoleLogger } from '../features/ConsoleLogger';
import { FF } from "@triviality/core";

export const createPrefixedLogger = (logger: LoggerInterface) => (prefix: string): LoggerInterface => {
  return new PrefixedLogger(logger, prefix);
};

export interface LogFeatureInstance {
  logger: LoggerInterface;
  prefixedLogger: (name: string) => LoggerInterface;
}

export const LogFeature: FF<LogFeatureInstance> = ({ construct, compose }) => ({
  logger: construct(ConsoleLogger),
  prefixedLogger: compose(createPrefixedLogger, 'logger'),
});
