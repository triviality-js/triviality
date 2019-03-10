import { Module } from '@triviality/core';
import { LoggerInterface } from '../LoggerInterface';

abstract class LoggerModule implements Module {

  public abstract logger(): LoggerInterface;

}

export { LoggerModule };
