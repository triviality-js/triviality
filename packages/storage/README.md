 # TS Eventsourcing Redux bridge
 
 Bridge between server side event sourcing and redux client state as projected read model.   
 
 [![Build Status](https://travis-ci.org/epinxteren/ts-eventsourcing-redux-bridge.svg?branch=master)](https://travis-ci.org/epinxteren/ts-eventsourcing-redux-bridge)
 
 ## Features
 - Using Typescript
 - Jest for testing
 - Serialisation of actions/commands and immutable objects
 - Command and Queries server <--> client communication
 - Support different gateways (sockets io with multiple namespace support)
 
 ## Just the basics
 
 If you brand new to Event sourcing, CQRS or Typescript and you want to understand the basics concepts, see
 
 - **[Command Query Responsibility Segregation]( https://martinfowler.com/bliki/CQRS.html)** explanation by Martin Fowler
 - Watch this **[Event sourcing](https://www.youtube.com/watch?v=I3uH3iiiDqY&t=192s)** video by Greg Young
 - The **[Typescript introduction](https://www.typescriptlang.org/docs/handbook/declaration-files/introduction.html)** 
 
 ## Installation
 
 To install the stable version:
 
 ```
 yarn install
 ```
 
 This assumes you are using [yarn](https://yarnpkg.com) as your package manager.
 
 ## Tests
 
 To Run the test-suites:
 
 ```
 yarn test
 ```
 
 ## License
 
 MIT