# Table of Contents

* [Triviality](#triviality)
  * [Why should you use Triviality](#why-should-you-use-triviality)
    * [Typescript to the rescue](#typescript-to-the-rescue)
  * [Features](#features)
  * [Service registries](#service-registries)
  * [Setup](#setup)
  * [Service overrides & decorators](#service-overrides-&-decorators)
    * [Overriding a service](#overriding-a-service)
    * [Decorating a service](#decorating-a-service)
* [Existing triviality features](#existing-triviality-features)
* [Installation](#installation)
* [Facts](#facts)
* [Thanks](#thanks)
* [Reads](#reads)


![Licence](https://img.shields.io/npm/l/triviality.svg) [![Build Status](https://travis-ci.org/epinxteren/triviality.svg?branch=master)](https://travis-ci.org/epinxteren/triviality) [![npm version](https://badge.fury.io/js/triviality.svg)](https://badge.fury.io/js/triviality) ![coverage](https://github.com/epinxteren/triviality/raw/master/docs/coverage.svg?sanitize=true)  

# Triviality

Your application is full of useful objects: a "HttpClient"
object might help you send requests while another object might
help you save things to some storage. Almost everything that your
application "does" is actually done by one of these objects.

In Triviality, these useful objects are called services and
each service lives inside a very special object
called the service container. The approach how a service is constructed and configured
is the definition of the service or in short the service definition.
The container allows you to centralize the way objects are constructed.
It makes your life easier, promotes a strong architecture. It’s
a design pattern aiming to make high-level code reusable.

## Why should you use Triviality

Triviality is inspired by the idea that non-trival issues should not
take your precious time and **infect** your application code. **Triviality** highly aims to keep away from your application code.
By separating the service definition from usage. **No magic** injection with tokens and/or annotations whatsoever. It will use your application code
as a **strictly typed interface** to assure everything is connected properly.

> Parkinson's law of triviality is C. Northcote Parkinson's 1957 argument
that members of an organization give disproportionate weight to trivial issues.
Parkinson provides the example of a fictional committee whose job was
to approve the plans for a nuclear power plant spending the majority
of its time on discussions about relatively minor but easy-to-grasp issues,
such as what materials to use for the staff bike shed, while neglecting the proposed
design of the plant itself, which is far more important and a
far more difficult and complex task.

### Typescript to the rescue

Triviality uses the full power of Typescript to ensure the ServiceContainer
is connected properly before your application code even has executed.

> It's not required to use Typescript when using Triviality, but it's highly recommended.

## Features

Triviality by its core is split into features. Each feature has his own services definitions
so it can serve it's unique and there separate logic.
A feature is defined as a class.


```typescript
import { Feature } from '@triviality/core';
import { LoggerInterface } from './LoggerInterface';
import { ConsoleLogger } from './ConsoleLogger';

export class LogFeature implements Feature {
  public logger(): LoggerInterface {
    return new ConsoleLogger();
  }
}
```
        

As you can see a feature class has functions. The function name is the service name.
The function implementation is the service definition. Before we can use the service from the service container
we need to build it:   


```typescript
import { triviality } from '@triviality/core';
import { LogFeature } from './LogFeature';

triviality()
  .add(LogFeature)
  .build()
  .then((container) => {
    const logger = container.logger();
    logger.info('Hallo word');
  });
```
        

Now we can fetch the 'logger' service from the service container and start using it. In the build step of the container, function results will be memorized and can be threaded as a
singleton based on the service factory arguments. For example, create a service with a single service factory argument:


```typescript
import { Feature } from '@triviality/core';
import { LoggerInterface } from '../features/LoggerInterface';
import { PrefixedLogger } from './PrefixedLogger';

export class LogFeature implements Feature {

  public logger(): LoggerInterface {
    return console;
  }

  public prefixedLogger(prefix: string): LoggerInterface {
    return new PrefixedLogger(this.logger(), prefix);
  }

}
```
        

The logger service function and the 'prefixedLogger' functions will always return the same instance for the same arguments. 


```typescript
import { triviality } from '@triviality/core';
import { LogFeature } from './LogFeature';

triviality()
  .add(LogFeature)
  .build()
  .then((container) => {
    const johnLogger = container.prefixedLogger('John:');
    johnLogger.info('Hallo Jane!');
    const janeLogger = container.prefixedLogger('Jane:');
    janeLogger.info('Hi John!');

  });
```
        


```bash
./node_modules/.bin/ts-node example/singleton/LogFeatureContainer.ts 
John: Hallo Jane!
Jane: Hi John!
```
        

___

The service container inherited the service types from all added features.
This gives typescript the option to **strictly type check** if everything is connected properly. 
And you the benefits of **code completion** and the option to quickly traverse the service chain.
___

We can inject the Feature with a Container that has multiple Feature dependencies ```Container<...Feature>```.
Let's put the type checking to the test, we create a nice feature that dependence on the 'LogFeature'.


```typescript
import { HalloService } from './HalloService';
import { Container, Feature } from '@triviality/core';
import { LogFeature } from '../features/LogFeature';

export class HalloFeature implements Feature {

  constructor(private container: Container<LogFeature>) {
  }

  public halloService(name: string): HalloService {
    return new HalloService(this.container.logger(), name);
  }
}
```
        

Build the service container with missing 'LogFeature' dependency:


```typescript
import { triviality } from '@triviality/core';
import { HalloFeature } from './HalloFeature';

triviality()
  .add(HalloFeature)
  .build()
  .then((container) => {
    const service = container.halloService('John');
    service.speak();
  });
```
        

If you forget a feature you see a nice error of typescript in your IDE.

    Error:(6, 8) TS2345: Argument of type 'typeof HalloFeature' is not assignable to parameter of type 'FeatureConstructor<HalloFeature, {}>'.
      Types of parameters 'container' and 'container' are incompatible.
        Property 'logger' is missing in type '{}' but required in type 'Readonly<Pick<LogFeature, "logger">>'.

Let's fix the service container by adding the LogFeature:


```typescript
import { triviality } from '@triviality/core';
import { LogFeature } from '../singleton/LogFeature';
import { HalloFeature } from './HalloFeature';

triviality()
  .add(LogFeature)
  .add(HalloFeature)
  .build()
  .then((container) => {
    const service = container.halloService('John');
    service.speak();
  });
```
        

```bash
./node_modules/.bin/ts-node example/featureDependency/HalloFeatureContainer.ts 
Hallo John
```
        

## Service registries

For triviality a service registry is a collection of services that share a common interface.
Multiple Features can *register* services to the service registry without knowing
anything about the other features.

For example let's create a service register for 'console commands' the services that are registered
should match the common interface 'ConsoleCommand':


```typescript
import { ConsoleInput } from './ConsoleInput';
import { ConsoleOutput } from './ConsoleOutput';

export interface ConsoleCommand {

  name(): string;

  execute(input: ConsoleInput, output: ConsoleOutput): void | Promise<void>;
}
```
        

For triviality a service registry is defined as a function

```typescript
() => ConsoleCommand[];
```

To define a registry inside a feature it needs to implement the 'registries' function.


```typescript
import { Feature } from '@triviality/core';
import { ConsoleCommand } from './ConsoleCommand';

export class ConsoleFeature implements Feature {

  public registries() {
    return {
      consoleCommands: (): ConsoleCommand[] => {
        return [];
      },
    };
  }

}
```
        

The 'registries' returns an associative-map, the key represents the name of the registry and the value the service registry.

It's possible to add a registry to multiple feature. In the next examples, both feature return one command service inside the registry function.
 

```typescript
import { Feature, Registries } from '@triviality/core';
import { ConsoleCommand } from '../ConsoleCommand';
import { HalloConsoleCommand } from './HalloConsoleCommand';
import { ConsoleFeature } from '../ConsoleFeature';

export class HalloConsoleFeature implements Feature {

  public registries(): Registries<ConsoleFeature> {
    return {
      consoleCommands: (): ConsoleCommand[] => {
        return [this.halloConsoleCommand()];
      },
    };
  }

  private halloConsoleCommand() {
    return new HalloConsoleCommand();
  }

}
```
        


```typescript
import { Feature, OptionalRegistries } from '@triviality/core';
import { ConsoleCommand } from '../ConsoleCommand';
import { ByeConsoleCommand } from './ByeConsoleCommand';
import { ConsoleFeature } from '../ConsoleFeature';

export class ByeConsoleFeature implements Feature {

  public registries(): OptionalRegistries<ConsoleFeature> {
    return {
      consoleCommands: (): ConsoleCommand[] => {
        return [this.byeConsoleCommand()];
      },
    };
  }

  private byeConsoleCommand() {
    return new ByeConsoleCommand();
  }

}
```
        

Multiple feature can define the registry. The implementation needs to match between features otherwise typescript will assist you with strict type checking errors.
During the service container build phase, the registries will be combined, so all registry functions will return the complete combined result.


```typescript
import { Feature } from '@triviality/core';
import { ConsoleCommand } from './ConsoleCommand';
import { ConsoleService } from './ConsoleService';

export class ConsoleFeature implements Feature {

  /**
   * The strict interface, all other feature needs to follow.
   */
  public registries() {
    return {
      consoleCommands: (): ConsoleCommand[] => {
        return [];
      },
    };
  }

  /**
   * Triviality will combine the result consoleCommands and return it as single array.
   */
  public consoleService() {
    return new ConsoleService(
      this.registries().consoleCommands(),
    );
  }

}
```
        

Now we can combine the different command feature and build the service container.


```typescript
import { triviality } from '@triviality/core';
import { ConsoleFeature } from './ConsoleFeature';
import { HalloConsoleFeature } from './Command/HalloConsoleFeature';
import { ByeConsoleFeature } from './Command/ByeConsoleFeature';

triviality()
  .add(ConsoleFeature)
  .add(HalloConsoleFeature)
  .add(ByeConsoleFeature)
  .build()
  .then((container) => {
    return container.consoleService().handle();
  });
```
        


```bash
./node_modules/.bin/ts-node example/registries/console.ts hallo john
Hallo john
```
        

```bash
./node_modules/.bin/ts-node example/registries/console.ts bye john
Bye john !!!
```
        

Registries can be fetched from the service container.

!["containerRegistries"](./example/registries/containerRegistries.png)

Typescript will verify if registers interface matches over multiple Features. You can add an extra verify by adding
response type to the feature registry function.

## Setup

The build step returns a single promise, Each feature can have its own specific setup
task. The feature can check if everything is configured properly or connect to external service like a database.


```typescript
import { Feature } from '@triviality/core';
import { Database } from './Database';

export class DatabaseFeature implements Feature {

  public setup() {
    if (!this.database().isConnected()) {
      throw new Error('Database is not connected!');
    }
  }

  public database(): Database {
    return new Database();
  }

}
```
        

Add a catch function to gracefully handle errors


```typescript
import { triviality } from '@triviality/core';
import { DatabaseFeature } from './DatabaseFeature';

triviality()
  .add(DatabaseFeature)
  .build()
  .then((container) => {
    container.database().someFancyQuery();
  })
  .catch((error) => {
    process.stdout.write(`${error}
`);
  });
```
        


```bash
./node_modules/.bin/ts-node example/setup/bootstrap.ts 
Error: Database is not connected!
```
        

## Service overrides & decorators

If you use an external feature, maybe you want to override some services. For example, we start with the following greetings feature:


```typescript
import { Feature } from '@triviality/core';
import { GreetingsServiceInterface } from './services/GreetingsServiceInterface';
import { CasualGreetingService } from './services/CasualGreetingService';

export class GreetingsFeature implements Feature {

  public greetingService(): GreetingsServiceInterface {
    return new CasualGreetingService();
  }

}
```
        

When we run 


```typescript
import { triviality } from '@triviality/core';
import { GreetingsFeature } from './GreetingsFeature';
import { LogFeature } from '../features/LogFeature';

triviality()
  .add(LogFeature)
  .add(GreetingsFeature)
  .build()
  .then((container) => {
    const logger = container.logger();
    const halloService = container.greetingService();
    logger.info(halloService.greet('Triviality'));
  });
```
        

We get:


```bash
./node_modules/.bin/ts-node example/overrides/bootstrapGreetingsFeature.ts 
Hallo Triviality
```
        

### Overriding a service

If we want to use a different way to greet we need to override the 'greetingService'


```typescript
import { Feature, OptionalContainer } from '@triviality/core';
import { GreetingsFeature } from './GreetingsFeature';
import { FormalGreetingsService } from './services/FormalGreetingsService';
import { GreetingsServiceInterface } from './services/GreetingsServiceInterface';

export class FormalGreetingsFeature implements Feature {
  public serviceOverrides(): OptionalContainer<GreetingsFeature> {
    return {
      greetingService: () => this.formalGreetingsService(),
    };
  }

  public formalGreetingsService(): GreetingsServiceInterface {
    return new FormalGreetingsService();
  }

}
```
        

```typescript
import { triviality } from '@triviality/core';
import { GreetingsFeature } from './GreetingsFeature';
import { LogFeature } from '../features/LogFeature';
import { FormalGreetingsFeature } from './FormalGreetingsFeature';

triviality()
  .add(LogFeature)
  .add(GreetingsFeature)
  .add(FormalGreetingsFeature)
  .build()
  .then((container) => {
    const logger = container.logger();
    const halloService = container.greetingService();
    logger.info(halloService.greet('Triviality'));
  });
```
        

Now the original 'greetingService' service is overridden for the hole application. If we now run the example we get the following result: 


```bash
./node_modules/.bin/ts-node example/overrides/bootstrapFormalGreetingsFeature.ts 
Pleased to meet you Triviality
```
        

### Decorating a service

If we still we to use the original service from the service container. We can fetch the original service from the 'serviceOverrides' container argument.
 
Let's be less formal by screaming the sentence: 


```typescript
import { GreetingsServiceInterface } from './GreetingsServiceInterface';

export class ScreamGreetingsService implements GreetingsServiceInterface {

  constructor(private speakService: GreetingsServiceInterface) {

  }

  public greet(name: string): string {
    return `${this.speakService.greet(name).toUpperCase()}!!!!!!`;
  }

}
```
        

```typescript
import { Container, Feature, OptionalContainer } from '@triviality/core';
import { ScreamGreetingsService } from './services/ScreamGreetingsService';
import { GreetingsFeature } from './GreetingsFeature';

export class ScreamGreetingsFeature implements Feature {
  public serviceOverrides(container: Container<GreetingsFeature>): OptionalContainer<GreetingsFeature> {
    return {
      greetingService: () => new ScreamGreetingsService(container.greetingService()),
    };
  }

}
```
        

```typescript
import { triviality } from '@triviality/core';
import { GreetingsFeature } from './GreetingsFeature';
import { LogFeature } from '../features/LogFeature';
import { ScreamGreetingsFeature } from './ScreamGreetingsFeature';

triviality()
  .add(LogFeature)
  .add(GreetingsFeature)
  .add(ScreamGreetingsFeature)
  .build()
  .then((container) => {
    const logger = container.logger();
    const halloService = container.greetingService();
    logger.info(halloService.greet('Triviality'));
  });
```
        

Now the original 'greetingService' service is overridden and we get:


```bash
./node_modules/.bin/ts-node example/overrides/bootstrapScreamGreetingsFeature.ts 
HALLO TRIVIALITY!!!!!!
```
        

# Existing triviality features

- npm: [Commander as a Triviality Definition](https://www.npmjs.com/package/@triviality/commander)
- npm: [Typescript loggers with an interface that support composition](https://www.npmjs.com/package/@triviality/logger)

# Installation

To install the stable version:

```
yarn add @triviality/core
```

This assumes you are using [yarn](https://yarnpkg.com) as your package manager.

or 

```
npm install @triviality/core
```

# Facts

* Supported both for *Web* and *Node*.
* Supported for [es5](https://caniuse.com/#search=es5)
* All definition functions (registers, service overrides, feature setups) can be asynchronous (Promises based).
* Support for Definition circular dependencies.

# Thanks

Special thanks to:

* Eric Pinxteren
* Wessel van der Linden

# Reads

Triviality is inspired by [disco](https://github.com/bitExpert/disco) without the annotations.

