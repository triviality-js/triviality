# Table of Contents

* [Installation](#installation)
* [Triviality logger](#triviality-logger)
  * [LoggerInterface](#loggerinterface)
  * [Example log level](#example-log-level)
* [Loggers](#loggers)
  * [console logger](#console-logger)
  * [process logger](#process-logger)
  * [prefix logger](#prefix-logger)
  * [log from LogLevel logger](#log-from-loglevel-logger)
  * [ts-log logger](#ts-log-logger)
  * [null logger](#null-logger)
  * [collection of loggers](#collection-of-loggers)
* [triviality features](#triviality-features)
* [Thanks](#thanks)
* [Reads](#reads)


![Licence](https://img.shields.io/npm/l/triviality-logger.svg) [![Build Status](https://travis-ci.org/epinxteren/triviality-logger.svg?branch=master)](https://travis-ci.org/epinxteren/triviality-logger) [![npm version](https://badge.fury.io/js/triviality-logger.svg)](https://badge.fury.io/js/triviality-logger) ![coverage](https://github.com/epinxteren/triviality-logger/raw/master/docs/coverage.svg?sanitize=true)  

# Installation

To install the stable version:

```
yarn add @triviality/logger
```

This assumes you are using [yarn](https://yarnpkg.com) as your package manager.

or 

```
npm install @triviality/logger
```

# Triviality logger

Exposes TypeScript Logger interface compatible with:

- Web and node
- [ts-log](https://www.npmjs.com/package/ts-log) interface
- [node-bunyan](https://github.com/trentm/node-bunyan) node-bunyan
- Compatible with triviality ServiceContainer. Pre-configured logger modules, ready to use in your Triviality modules.
- Add composition functionality for combing loggers

## LoggerInterface

Besides the normal log functions each logger has it's log function. The log function that support logging based on LogLevel. 
Can be used for easy composition.


```typescript
export enum LogLevel {
  trace,
  debug,
  info,
  warn,
  error,
}

export interface LoggerInterface {
  trace(message?: any, ...optionalParams: any[]): void;
  debug(message?: any, ...optionalParams: any[]): void;
  info(message?: any, ...optionalParams: any[]): void;
  warn(message?: any, ...optionalParams: any[]): void;
  error(message?: any, ...optionalParams: any[]): void;

  log(level: LogLevel, message: any, ...optionalParams: any[]): void;
}
```
        

## Example log level


```typescript
import { ConsoleLogger } from '@triviality/logger';
import { LogLevel } from '@triviality/logger';

const logger = new ConsoleLogger(console);
logger.log(LogLevel.info, 'Hallo', 'World');
```
        


```bash
./node_modules/.bin/ts-node example/logLevel.ts 
Hallo World
```
        

# Loggers

## console logger


```typescript
import { ConsoleLogger } from '@triviality/logger';

const logger = new ConsoleLogger(console);
logger.info('Hallo', 'World');
logger.info('Bye %s', 'World');
```
        


```bash
./node_modules/.bin/ts-node example/consoleLogger.ts 
Hallo World
Bye World
```
        

## process logger


```typescript
import { ProcessLogger } from '@triviality/logger';

const logger = new ProcessLogger(process);
logger.info('Hallo', 'World');
```
        


```bash
./node_modules/.bin/ts-node example/processLogger.ts 
Hallo World
```
        

## prefix logger


```typescript
import { ConsoleLogger } from '@triviality/logger';
import { PrefixLogger } from '@triviality/logger';

const logger = new ConsoleLogger(console);
const withPrefix = new PrefixLogger(logger, 'Hallo: ');
withPrefix.info('World');
```
        


```bash
./node_modules/.bin/ts-node example/prefixLogger.ts 
Hallo: World
```
        

## log from LogLevel logger


```typescript
import { ConsoleLogger } from '@triviality/logger';
import { FromLogLevelLogger } from '@triviality/logger';
import { LogLevel } from '@triviality/logger';

const logger = new ConsoleLogger(console);
const witPrefix = new FromLogLevelLogger(logger, LogLevel.info);
witPrefix.trace('This will be ignored');
witPrefix.info('Hallo!');
```
        


```bash
./node_modules/.bin/ts-node example/fromLogLevelLogger.ts 
Hallo!
```
        

## ts-log logger

With this you can also wrap [node-bunyan](https://github.com/trentm/node-bunyan) 


```typescript
import { TsLogLogger } from '@triviality/logger';
import { Logger } from 'ts-log';

const tsLogger: Logger = console;
const logger = new TsLogLogger(tsLogger);
logger.info('Hallo', 'World');
```
        


```bash
./node_modules/.bin/ts-node example/tsLogLogger.ts 
Hallo World
```
        

## null logger


```typescript
import { NullLogger } from '@triviality/logger';

const logger = new NullLogger();
logger.info('Hallo', 'Void');
```
        

## collection of loggers

Combine loggers into a single one.


```typescript
import { CollectionLogger } from '@triviality/logger';
import { ConsoleLogger } from '@triviality/logger';
import { PrefixLogger } from '@triviality/logger';

const consoleLogger = new ConsoleLogger(console);
const logger = new CollectionLogger([
  new PrefixLogger(consoleLogger, 'Hallo '),
  new PrefixLogger(consoleLogger, 'Bye '),
]);
logger.info('World');
```
        


```bash
./node_modules/.bin/ts-node example/collectionLogger.ts 
Hallo World
Bye World
```
        

## Abstract logger class

You can extends one of the abstract logger, so you only need to implement some of the log function.


```typescript
import { LoggerInterface, LogLevel } from './LoggerInterface';

export abstract class AbstractLogLevelLogger implements LoggerInterface {
  public trace(message?: any, ...optionalParams: any[]): void {
    this.log(LogLevel.trace, message, ...optionalParams);
  }

  public debug(message?: any, ...optionalParams: any[]): void {
    this.log(LogLevel.debug, message, ...optionalParams);
  }

  public info(message?: any, ...optionalParams: any[]): void {
    this.log(LogLevel.info, message, ...optionalParams);
  }

  public warn(message?: any, ...optionalParams: any[]): void {
    this.log(LogLevel.warn, message, ...optionalParams);
  }

  public error(message?: any, ...optionalParams: any[]): void {
    this.log(LogLevel.error, message, ...optionalParams);
  }

  public abstract log(type: LogLevel, message?: any, ...optionalParams: any[]): void;

}
```
        


```typescript
import { LoggerInterface, LogLevel } from './LoggerInterface';

export abstract class AbstractFunctionLogger implements LoggerInterface {

  public abstract trace(message?: any, ...optionalParams: any[]): void;
  public abstract debug(message?: any, ...optionalParams: any[]): void;
  public abstract info(message?: any, ...optionalParams: any[]): void;
  public abstract warn(message?: any, ...optionalParams: any[]): void;
  public abstract error(message?: any, ...optionalParams: any[]): void;

  public log(level: LogLevel, message?: any, ...optionalParams: any[]): void {
    switch (level) {
      case LogLevel.trace:
        this.trace(message, ...optionalParams);
        break;
      case LogLevel.debug:
        this.debug(message, ...optionalParams);
        break;
      case LogLevel.info:
        this.info(message, ...optionalParams);
        break;
      case LogLevel.warn:
        this.warn(message, ...optionalParams);
        break;
      case LogLevel.error:
        this.error(message, ...optionalParams);
        break;
      default:
        throw new Error(`Log level "${level}" not supported`);
    }

  }

}
```
        

## Jest test logger

Logger with jest spies for each particular log function. 


```typescript
import { LoggerInterface } from './LoggerInterface';
import { AbstractFunctionLogger } from './AbstractFunctionLogger';

export class JestTestLogger extends AbstractFunctionLogger implements LoggerInterface {

  public trace = jest.fn();
  public info = jest.fn();
  public warn = jest.fn();
  public debug = jest.fn();
  public error = jest.fn();

  public mockReset() {
    this.trace.mockReset();
    this.info.mockReset();
    this.warn.mockReset();
    this.debug.mockReset();
    this.error.mockReset();
  }

}
```
        

# triviality features

Logger reference module, so you can reference your module to a non-concrete implementation.


```typescript
import { Feature } from '@triviality/core';
import { LoggerInterface } from '../LoggerInterface';

abstract class LoggerFeature implements Feature {

  public abstract logger(): LoggerInterface;

}

export { LoggerFeature };
```
        

For example you reference the logger module like:


```typescript
import { Container, Feature } from '@triviality/core';
import { LoggerFeature } from '@triviality/logger';
import { HalloService } from './HalloService';

export class MyFeature implements Feature {

  constructor(private container: Container<LoggerFeature>) {

  }

  public halloService() {
    return new HalloService(this.container.logger());
  }

}
```
        

And build the container like:


```typescript
import { ContainerFactory } from '@triviality/core';
import { DefaultLoggerFeature } from '@triviality/logger';
import { MyFeature } from './Feature/MyFeature';

ContainerFactory
  .create()
  .add(DefaultLoggerFeature)
  .add(MyFeature)
  .build()
  .then((container) => {
    container.halloService().printHallo('Jane');
  });
```
        


```bash
./node_modules/.bin/ts-node example/defaultLoggerFeature.ts 
03/11/2019 9:47:48 AM:Hallo Jane
```
        

# Thanks

Special thanks to:

* Eric Pinxteren

# Reads

[triviality](https://github.com/epinxteren/triviality)

[node-bunyan](https://github.com/trentm/node-bunyan)

[ts-log](https://www.npmjs.com/package/ts-log)

[log4js](https://www.npmjs.com/package/log4js)

[typescript-logging](https://www.npmjs.com/package/typescript-logging)

[typescript-logging-developer-extension](https://www.npmjs.com/package/typescript-logging#typescript-logging-developer-extension)

