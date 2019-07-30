import { ConsoleLogger } from '../features/ConsoleLogger';
import { LoggerInterface } from '../features/LoggerInterface';

function createLogger(): LoggerInterface {
  return new ConsoleLogger();
}

export const LogFeature = () => ({
  logger: createLogger,
});
