# Triviality logger !heading

Exposes TypeScript Logger interface compatible with:

- Web and node
- [ts-log](https://www.npmjs.com/package/ts-log) interface
- [node-bunyan](https://github.com/trentm/node-bunyan) node-bunyan
- Compatible with triviality ServiceContainer. Pre-configured logger modules, ready to use in your Triviality modules.
- Add composition functionality for combing loggers

## LoggerInterface !heading

Besides the normal log functions each logger has it's log function. The log function that support logging based on LogLevel. 
Can be used for easy composition.

######typescript "src/LoggerInterface.ts"

## Example log level !heading

######typescript "example/logLevel.ts"

######ts-node "example/logLevel.ts"

# Loggers !heading

## console logger !heading

######typescript "example/consoleLogger.ts"

######ts-node "example/consoleLogger.ts"

## process logger !heading

######typescript "example/processLogger.ts"

######ts-node "example/processLogger.ts"

## prefix logger !heading

######typescript "example/prefixLogger.ts"

######ts-node "example/prefixLogger.ts"

## log from LogLevel logger !heading

######typescript "example/fromLogLevelLogger.ts"

######ts-node "example/fromLogLevelLogger.ts"

## ts-log logger !heading

With this you can also wrap [node-bunyan](https://github.com/trentm/node-bunyan) 

######typescript "example/tsLogLogger.ts"

######ts-node "example/tsLogLogger.ts"

## null logger !heading

######typescript "example/nullLogger.ts"

## collection of loggers !heading

Combine loggers into a single one.

######typescript "example/collectionLogger.ts"

######ts-node "example/collectionLogger.ts"

## Abstract logger class

You can extends one of the abstract logger, so you only need to implement some of the log function.

######typescript "src/AbstractLogLevelLogger.ts"

######typescript "src/AbstractFunctionLogger.ts"

## Jest test logger

Logger with jest spies for each particular log function. 

######typescript "src/JestTestLogger.ts"

# triviality modules !heading

Logger reference module, so you can reference your module to a non-concrete implementation.

######typescript "src/Module/LoggerModule.ts"

For example you reference the logger module like:

######typescript "example/Module/MyModule.ts"

And build the container like:

######typescript "example/defaultLoggerModule.ts"

######ts-node "example/defaultLoggerModule.ts"
