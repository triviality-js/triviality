import { LoggerInterface } from '../features/LoggerInterface';
import { PrefixedLogger } from '../singleton/PrefixedLogger';

export const createConsoleLogger = (): LoggerInterface => {
  return console;
};

export const createPrefixedLogger = (logger: () => LoggerInterface) => (prefix: string): LoggerInterface => {
  return new PrefixedLogger(logger(), prefix);
};

export const LogFeature = ({ logger }: { logger: () => LoggerInterface }) => ({
  logger: createConsoleLogger,
  prefixedLogger: createPrefixedLogger(logger),
});
