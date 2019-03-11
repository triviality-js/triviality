import { Feature } from '@triviality/core';
import { LoggerInterface } from '../LoggerInterface';

abstract class LoggerFeature implements Feature {

  public abstract logger(): LoggerInterface;

}

export { LoggerFeature };
