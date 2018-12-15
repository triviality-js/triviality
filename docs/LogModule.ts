import { Module } from '../src';
import { LoggerInterface } from './Example/LoggerInterface';

export class LogModule implements Module {
  public logger(): LoggerInterface {
    return console;
  }
}
