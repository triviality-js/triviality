# Triviality !heading

Dependency Injection is all about code reusability. 
It’s a design pattern aiming to make high-level code reusable, 
by separating the object creation / configuration from usage. **Triviality** highly aims to keep away from your application code. 
**No magic** injection with tokens, annotations whatsoever. It will use your application code 
as **strictly typed interface** to assure everything is connected properly. 

Triviality by core is split into Modules. A module is defined as a class. Each module has his own services definitions 
so each module can serve it's unique and there separate logic.

#typescript "example/module/LogModule.ts"

As you can see a module class has functions. The function name is the service name. The function implementation the service factory. Before we can call the service from the container
we need to build it:

#typescript "example/module/LogModuleContainer.ts"

Now we can fetch the 'logger' service from the container and start using it. This service will be a singleton based on the service factory arguments.

#typescript "example/singleton/LogModule.ts"

The logger service function and the 'prefixedLoggerService' functions will always return the same instance for the same arguments. 

#typescript "example/singleton/LogModuleContainer.ts"
___

The container service function types are directly copied from the Modules.
This gives typescript the option to **strictly type check** if everything is connected properly. 
And you the benefits of **code completion** and the option to quickly traverse to the service chain.
___

Let's put the type checking to the test, we create a nice module that use the 'LogModule'.

#typescript "example/moduleDependency/HalloModule.ts"

The container missing 'LogModule' dependency:

#typescript "example/moduleDependency/HalloModuleErrorContainer.ts.example"

If you forget a module you see a nice error of typescript in your IDE.

!["Module requirement error"](./example/moduleDependency/HalloModuleErrorContainer.png)

    Error:(6, 8) TS2345: Argument of type 'typeof HalloModule' is not assignable to parameter of type 'ModuleConstructor<HalloModule, {}>'.
      Types of parameters 'container' and 'container' are incompatible.
        Property 'logger' is missing in type '{}' but required in type 'Readonly<Pick<LogModule, "logger">>'.

Let's fix the container by adding the LogModule:

#typescript "example/moduleDependency/HalloModuleContainer.ts"

```
Hallo John
```

## Registers !heading

Registers are a collection of services so other module can use the registered services without knowing about anything about the other module.

Let's create a register for 'console commands'

#typescript "example/registries/ConsoleModule.registerOnly.ts"

Like a module, the 'registries' function returns an object. The key are registry names. The implementation the services that needs to be added to the registry.
 
#typescript "example/registries/Command/HalloConsoleModule.ts"

#typescript "example/registries/Command/ByeConsoleModule.ts"

Multiple modules can define the registry. The implementation needs to match between modules otherwise typescript will assist you with strict type checking.
During the container build phase the registries will be combined. 

#typescript "example/registries/ConsoleModule.ts"

Now we can combine all the different modules and build the final container.

#typescript "example/registries/console.ts"

```bash
 ✗ ./node_modules/.bin/ts-node example/registries/console.ts hallo John
Hallo John
✗ ./node_modules/.bin/ts-node example/registries/console.ts bye John
Bye John !!!
```
