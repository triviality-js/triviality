# Table of Contents

* [Installation](#installation)
* [Triviality commander](#triviality-commander)
  * [Example](#example)
* [Usage](#usage)
* [Thanks](#thanks)
* [Reads](#reads)


# Installation

To install the stable version:

```
yarn add @triviality/commander
```

This assumes you are using [yarn](https://yarnpkg.com) as your package manager.

or 

```
npm install @triviality/commander
```

# Triviality commander

Add integration for [Commander](https://www.npmjs.com/package/commander) in Triviality.

- Add option to split commands configuration over multiple Modules into multiple configuration services.
- Exposes Module for automatic version based on your package.json
- StartCommanderService service that response when no valid command is given. 
  
## Example
 
Example commander configuration:


```typescript
import { Command } from 'commander';
import { CommanderConfigurationInterface } from '@triviality/commander';

export class CommanderHelloConfiguration implements CommanderConfigurationInterface {

  public async configure(program: Command) {
    program
      .command('hello <name>')
      .description('Say hello to someone')
      .option('-s, --shout', 'shout the hello message')
      .action((name, cmd: { shout: boolean }) => {
        const message = `hello ${name}`;
        console.log(cmd.shout ? message.toUpperCase() : message);
      });
  }
}
```
        

Module with configuration added to the configuration registry: 


```typescript
import { Module } from '@triviality/core';
import { CommanderConfigurationInterface } from '@triviality/commander';
import { CommanderHelloConfiguration } from './CommanderHelloConfiguration';
import { CommanderByeConfiguration } from './CommanderByeConfiguration';

export class CommanderExampleModule implements Module {
  public registries() {
    return {
      commanderConfigurations: (): CommanderConfigurationInterface[] => {
        return [
          this.commanderExampleConfiguration(),
          this.commanderByeExample(),
        ];
      },
    };
  }

  public commanderExampleConfiguration() {
    return new CommanderHelloConfiguration();
  }

  public commanderByeExample() {
    return new CommanderByeConfiguration();
  }
}
```
        

Add the module to the ContainerFactory


```typescript
import { ContainerFactory } from '@triviality/core';
import { CommanderFeature } from '@triviality/commander';
import { CommanderPackageVersionFeature } from '@triviality/commander';
import { CommanderExampleModule } from './CommanderExampleModule';

ContainerFactory
  .create()
  .add(CommanderFeature)
  .add(CommanderPackageVersionFeature)
  .add(CommanderExampleModule)
  .build()
  .then((container) => {
    container
      .startCommanderService()
      .start();
  });
```
        

if we run the file, we can call the actual commands.


```bash
./node_modules/.bin/ts-node example/bootstrap.ts hello world
hello world
```
        


```bash
./node_modules/.bin/ts-node example/bootstrap.ts bye world
bye world
```
        


```bash
./node_modules/.bin/ts-node example/bootstrap.ts hello world --shout
HELLO WORLD
```
        

## Version

CommanderPackageVersionModule exposes automatic version to commander based on your package.json


```bash
./node_modules/.bin/ts-node example/bootstrap.ts --version
0.4.0
```
        

# Usage

To create a terminal application you can best use [ts-node](https://www.npmjs.com/package/ts-node). 
Call your typescript service container from there.


```typescript
#!/usr/bin/env node

require("ts-node/register");
require("./example/bootstrap");
```
        

Don't forget to give it executable permissions (chmod +x ./cli.js).

Now you can directly run your commands:

######cli "cli.js"(hello world -s)
######cli "cli.js"(bye world)

# Thanks

Special thanks to:

* Eric Pinxteren

# Reads

[commander](https://github.com/tj/commander.js#readme)

[triviality](https://github.com/triviality-js/triviality)

