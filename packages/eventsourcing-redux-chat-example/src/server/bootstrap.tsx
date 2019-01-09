import 'source-map-support/register';
import { ContainerFactory } from 'triviality';
import { CommonModule } from '../shared/CommonModule';
import { EventSourcingModule } from './EventSourcingModule';
import { UserModule } from './UserModule';
import { WebModule } from './WebModule';
import { ChatChannelModule } from './ChatChannelModule';
import { CommanderModule, CommanderPackageVersionModule } from 'triviality-commander';

ContainerFactory
  .create()
  .add(CommanderModule)
  .add(CommanderPackageVersionModule)
  .add(CommonModule)
  .add(EventSourcingModule)
  .add(WebModule)
  .add(UserModule)
  .add(ChatChannelModule)
  .build()
  .then((container) => {
    container.startCommanderService().start();
  });
