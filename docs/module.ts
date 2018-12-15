import { Module } from '../src';
import { LoggerInterface } from './Example/LoggerInterface';

export class MyModule implements Module {
  public halloService(): LoggerInterface {
    return console;
  }
}
