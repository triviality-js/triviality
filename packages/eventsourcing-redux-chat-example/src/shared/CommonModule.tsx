import 'source-map-support/register';
import { ChannelState } from './State/ChannelState';
import { ChatChannelId } from './ValueObject/ChatChannelId';
import { AccountState } from '../client/Account/AcountState';
import { UserId } from './ValueObject/UserId';
import { QueryAccountState } from '../server/Query/QueryAccountState';
import { ConsoleLogger } from 'triviality-logger/ConsoleLogger';
import { LoggerInterface } from 'triviality-logger/LoggerInterface';
import { Module } from 'triviality';
import { TransitJSSerializer } from 'eventsourcing-redux-bridge/Serializer/transit-js/TransitJSSerializer';
import { ChatState } from './State/ChatState';
import { createClassHandlers } from 'eventsourcing-redux-bridge/Serializer/transit-js/createClassHandlers';
import { UserRegisterCommand } from '../server/Command/UserRegisterCommand';
import { UserHasRegistered } from '../server/DomainEvent/UserHasRegistered';
import { SerializerInterface } from 'ts-eventsourcing/Serializer/SerializerInterface';

export class CommonModule implements Module {

  public logger(): LoggerInterface {
    return new ConsoleLogger(console);
  }

  public serializer(): SerializerInterface {
    return new TransitJSSerializer(
      [
        AccountState,
        ChannelState,
        ChatState,
      ],
      createClassHandlers({
        // Value Objects
        UserId,
        ChatChannelId,

        // Commands
        UserRegisterCommand,

        // Queries
        QueryAccountState,

        // Domain events
        UserHasRegistered,
      }),
    );
  }
}
