import { ChannelState } from './State/ChannelState';
import { UserId } from './ValueObject/UserId';
import { ChatChannelId } from './ValueObject/ChatChannelId';
import { UserRegisterCommand } from '../server/Command/UserRegisterCommand';
import { SerializerInterface } from 'eventsourcing-redux-bridge/Serializer/SerializerInterface';
import { TransitJSSerializer } from 'eventsourcing-redux-bridge/Serializer/transit-js/TransitJSSerializer';
import { createClassHandlers } from 'eventsourcing-redux-bridge/Serializer/transit-js/createClassHandlers';
import { UserHasRegistered } from '../server/DomainEvent/UserHasRegistered';
import { ChatState } from './State/ChatState';
import { QueryAccountState } from "../server/Query/QueryAccountState";
import { AccountState } from "../client/Account/AcountState";

export function createSerializer(): SerializerInterface {
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
