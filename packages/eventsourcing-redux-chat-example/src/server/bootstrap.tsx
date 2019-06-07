import { CommanderFeature, CommanderPackageVersionFeature } from '@triviality/commander';
import { ContainerFactory } from '@triviality/core';
import { EventsourcingReduxServerFeature } from '@triviality/eventsourcing-redux/EventsourcingReduxServerFeature';
import { EventSourcingFeature } from '@triviality/eventsourcing/EventSourcingFeature';
import { DefaultLoggerFeature } from '@triviality/logger';
import { TransitJsSerializerFeature } from '@triviality/serializer/transit-js';
import { CommonFeature } from '../shared/CommonFeature';
import { ChatChannelFeature } from './ChatChannelFeature';
import { UserFeature } from './UserFeature';
import { WebFeature } from './WebFeature';

ContainerFactory
  .create()
  .add(TransitJsSerializerFeature)
  .add(DefaultLoggerFeature)
  .add(CommanderFeature)
  .add(CommanderPackageVersionFeature)
  .add(CommonFeature)
  .add(EventSourcingFeature)
  .add(EventsourcingReduxServerFeature)
  .add(WebFeature)
  .add(UserFeature)
  .add(ChatChannelFeature)
  .build()
  .then((container) => {
    container.startCommanderService().start();
  });
