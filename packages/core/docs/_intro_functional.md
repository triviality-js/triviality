# Functional

## Features !heading

Triviality by its core is split into features. Each feature has his own services definitions
so it can serve it's unique and there separate logic.
A feature is defined as a class or service factory.

######typescript "example/features-functional/LogFeature.ts"

As you can see a feature class has functions. The function name is the service name.
The function implementation is the service definition. Before we can use the service from the service container
we need to build it:   

######typescript "example/features-functional/LogFeatureContainer.ts"

Now we can fetch the 'logger' service from the service container and start using it. In the build step of the container, function results will be memorized and can be threaded as a
singleton based on the service factory arguments. For example, create a service with a single service factory argument:

######typescript "example/singleton-functional/LogFeature.ts"

The logger service function and the 'prefixedLogger' functions will always return the same instance for the same arguments. 

######typescript "example/singleton-functional/LogFeatureContainer.ts"
___

The service container inherited the service types from all added features.
This gives typescript the option to **strictly type check** if everything is connected properly. 
And you the benefits of **code completion** and the option to quickly traverse the service chain.
___

We can inject the Feature with a Container that has multiple Feature dependencies ```Container<...Feature>```.
Let's put the type checking to the test, we create a nice feature that dependence on the 'LogFeature'.

######typescript "example/featureDependency-functional/HalloFeature.ts"

Build the service container with missing 'LogFeature' dependency:

######typescript "example/featureDependency-functional/HalloFeatureErrorContainer.ts.example"

If you forget a feature you see a nice error of typescript in your IDE.

    Error:(6, 8) TS2345: Argument of type 'typeof HalloFeature' is not assignable to parameter of type 'FeatureConstructor<HalloFeature, {}>'.
      Types of parameters 'container' and 'container' are incompatible.
        Property 'logger' is missing in type '{}' but required in type 'Readonly<Pick<LogFeature, "logger">>'.

Let's fix the service container by adding the LogFeature:

######typescript "example/featureDependency-functional/HalloFeatureContainer.ts"
######ts-node "example/featureDependency-functional/HalloFeatureContainer.ts"

## Service registries !heading

For triviality a service registry is a collection of services that share a common interface.
Multiple Features can *register* services to the service registry without knowing
anything about the other features.

For example let's create a service register for 'console commands' the services that are registered
should match the common interface 'ConsoleCommand':

######typescript "example/registries/ConsoleCommand.ts"

For triviality a service registry is defined as a function

```typescript
() => ConsoleCommand[];
```

To define a registry inside a feature it needs to implement the 'registries' function.

######typescript "example/registries-functional/ConsoleFeature.registerOnly.ts"

The 'registries' returns an associative-map, the key represents the name of the registry and the value the service registry.

It's possible to add a registry to multiple feature. In the next examples, both feature return one command service inside the registry function.
 
######typescript "example/registries-functional/Command/HalloConsoleFeature.ts"

######typescript "example/registries-functional/Command/ByeConsoleFeature.ts"

Multiple feature can define the registry. The implementation needs to match between features otherwise typescript will assist you with strict type checking errors.
During the service container build phase, the registries will be combined, so all registry functions will return the complete combined result.

######typescript "example/registries-functional/ConsoleFeature.ts"

Now we can combine the different command feature and build the service container.

######typescript "example/registries-functional/console.ts"

######ts-node "example/registries-functional/console.ts"(hallo john)
######ts-node "example/registries-functional/console.ts"(bye john)

Registries can be fetched from the service container.

!["containerRegistries"](./example/registries-functional/containerRegistries.png)

Typescript will verify if registers interface matches over multiple Features. You can add an extra verify by adding
response type to the feature registry function.

## Setup !heading

The build step returns a single promise, Each feature can have its own specific setup
task. The feature can check if everything is configured properly or connect to external service like a database.

######typescript "example/setup-functional/DatabaseFeature.ts"

Add a catch function to gracefully handle errors

######typescript "example/setup-functional/bootstrap.ts"

######ts-node "example/setup-functional/bootstrap.ts"

## Service overrides & decorators !heading

If you use an external feature, maybe you want to override some services. For example, we start with the following greetings feature:

######typescript "example/overrides-functional/GreetingsFeature.ts"

When we run 

######typescript "example/overrides-functional/bootstrapGreetingsFeature.ts"

We get:

######ts-node "example/overrides-functional/bootstrapGreetingsFeature.ts"

### Overriding a service !heading

If we want to use a different way to greet we need to override the 'greetingService'

######typescript "example/overrides-functional/FormalGreetingsFeature.ts"
######typescript "example/overrides-functional/bootstrapFormalGreetingsFeature.ts"

Now the original 'greetingService' service is overridden for the hole application. If we now run the example we get the following result: 

######ts-node "example/overrides-functional/bootstrapFormalGreetingsFeature.ts"

### Decorating a service !heading

If we still we to use the original service from the service container. We can fetch the original service from the 'serviceOverrides' container argument.
 
Let's be less formal by screaming the sentence: 

######typescript "example/overrides/services/ScreamGreetingsService.ts"
######typescript "example/overrides-functional/ScreamGreetingsFeature.ts"
######typescript "example/overrides-functional/bootstrapScreamGreetingsFeature.ts"

Now the original 'greetingService' service is overridden and we get:

######ts-node "example/overrides-functional/bootstrapScreamGreetingsFeature.ts"
