import { Container, Feature, OptionalRegistries } from '@triviality/core';
import { QueryStateResponse } from '@triviality/eventsourcing-redux/QueryHandling/QueryStateResponse';
import { RecordConstructor } from '@triviality/serializer/src/transit-js/TransitJSSerializer';
import { TransitJsSerializerFeature } from '@triviality/serializer/transit-js';
import 'source-map-support/register';
import { AccountState } from '../client/Account/AcountState';
import { UserLoginCommand } from '../server/Command/UserLoginCommand';
import { UserLogoutCommand } from '../server/Command/UserLogoutCommand';
import { UserRegisterCommand } from '../server/Command/UserRegisterCommand';
import { UserHasLoggedIn } from '../server/DomainEvent/UserHasLoggedIn';
import { UserHasLoggedOut } from '../server/DomainEvent/UserHasLoggedOut';
import { UserHasRegistered } from '../server/DomainEvent/UserHasRegistered';
import { QueryAccountState } from '../server/Query/QueryAccountState';
import { ChannelState } from './State/ChannelState';
import { ChatState } from './State/ChatState';
import { ChatChannelId } from './ValueObject/ChatChannelId';
import { UserId } from './ValueObject/UserId';

export class CommonFeature implements Feature {

  constructor(_container: Container<TransitJsSerializerFeature>) {
    // noop.
    // TODO: check how to add registries as dep requirements.
  }

  public registries(): OptionalRegistries<TransitJsSerializerFeature> {
    return {
      serializableRecords: (): RecordConstructor[] => {
        // TODO: why are these not records?
        return [
          AccountState,
          ChannelState,
          ChatState,
        ] as any;
      },
      serializableClasses: () => {
        return {
          // Value Objects
          UserId,
          ChatChannelId,

          // Commands
          UserRegisterCommand,
          UserLoginCommand,
          UserLogoutCommand,

          // Queries
          QueryAccountState,

          // Query responses
          QueryStateResponse,

          // Domain events
          UserHasRegistered,
          UserHasLoggedIn,
          UserHasLoggedOut,
        };
      },
    };
  }
}
