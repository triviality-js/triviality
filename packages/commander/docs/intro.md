# Triviality commander !heading

Add integration for [Commander](https://www.npmjs.com/package/commander) in Triviality.

- Add option to split commands configuration over multiple Modules into multiple configuration services.
- Exposes Module for automatic version based on your package.json
- StartCommanderService service that response when no valid command is given. 
  
## Example !heading
 
Example commander configuration:

######typescript "example/CommanderHelloConfiguration.ts"

Module with configuration added to the configuration registry: 

######typescript "example/CommanderExampleModule.ts"

Add the module to the ContainerFactory

######typescript "example/bootstrap.ts"

if we run the file, we can call the actual commands.

######ts-node "example/bootstrap.ts"(hello world)

######ts-node "example/bootstrap.ts"(bye world)

######ts-node "example/bootstrap.ts"(hello world --shout)

## Version

CommanderPackageVersionModule exposes automatic version to commander based on your package.json

######ts-node "example/bootstrap.ts"(--version)
