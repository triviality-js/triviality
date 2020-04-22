import { LoggerInterface } from '../LoggerInterface';
import { ConsoleLogger } from '../ConsoleLogger';
import { PrefixDateLogger } from '../PrefixDateLogger';
import { FF } from '@triviality/core';

export interface LoggerFeatureServices {
  logger: LoggerInterface;
}

export const DefaultLoggerFeature: FF<LoggerFeatureServices, {}> = () => ({

  logger: () => new PrefixDateLogger(new ConsoleLogger(console)),

});
