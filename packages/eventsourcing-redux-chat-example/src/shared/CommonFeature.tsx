import { FF } from '@triviality/core';
import { QueryStateResponse } from '@triviality/eventsourcing-redux/QueryHandling/QueryStateResponse';
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
import { TransitJsSerializerFeatureServices } from '@triviality/serializer/transit-js';

export interface CommonFeatureServices {

}

export interface CommonFeatureDependencies extends TransitJsSerializerFeatureServices {

}

export const CommonFeature: FF<CommonFeatureServices, CommonFeatureDependencies> =
  ({
     registers: {
       serializableRecords,
       serializableClasses,
     },
   }) => {

    serializableRecords(() => AccountState);
    serializableRecords(() => ChannelState as any);
    serializableRecords(() => ChatState);

    serializableClasses({
      // Value Objects
      UserId: () => UserId,
      ChatChannelId: () => ChatChannelId,

      // Commands
      UserRegisterCommand: () => UserRegisterCommand,
      UserLoginCommand: () => UserLoginCommand,
      UserLogoutCommand: () => UserLogoutCommand,

      // Queries
      QueryAccountState: () => QueryAccountState,

      // Query responses
      QueryStateResponse: () => QueryStateResponse,

      // Domain events
      UserHasRegistered: () => UserHasRegistered,
      UserHasLoggedIn: () => UserHasLoggedIn,
      UserHasLoggedOut: () => UserHasLoggedOut,
    });

    return {};
  };
