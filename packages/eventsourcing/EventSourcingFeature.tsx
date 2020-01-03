import { FF, RegistryList, SetupFeatureServices } from '@triviality/core';
import { LoggerFeatureServices, PrefixLogger } from '@triviality/logger';
import { CommandBus } from './CommandHandling/CommandBus';
import { CommandHandler } from './CommandHandling/CommandHandler';
import { SimpleCommandBus } from './CommandHandling/SimpleCommandBus';
import { AggregateDomainEventStreamDecorator } from './Domain/Decorator/AggregateDomainEventStreamDecorator';
import { DomainEventStreamDecorator } from './Domain/DomainEventStreamDecorator';
import { AsynchronousEventBus } from './EventHandling/EventBus/AsynchronousEventBus';
import { EventStore } from './EventStore/EventStore';
import { InMemoryEventStore } from './EventStore/InMemoryEventStore';
import { QueryBus } from './QueryHandling/QueryBus';
import { QueryHandler } from './QueryHandling/QueryHandler';
import { SimpleQueryBus } from './QueryHandling/SimpleQueryBus';
import { ReplayService } from './ReplayService';
import { EventListener } from './EventHandling/EventListener';

export interface EventSourcingFeatureServices {
  commandHandlers: RegistryList<CommandHandler>;
  queryHandlers: RegistryList<QueryHandler>;
  eventListeners: RegistryList<EventListener>;
  domainEventStreamDecorators: RegistryList<DomainEventStreamDecorator>;

  commandBus: CommandBus;

  queryBus: QueryBus;

  domainEventStreamDecorator: AggregateDomainEventStreamDecorator;

  replayService: ReplayService;

  eventStore: EventStore;

  domainEventBus: AsynchronousEventBus;

  setupEventSourcing(): Promise<void>;
}

export const EventSourcingFeature: FF<EventSourcingFeatureServices, LoggerFeatureServices & SetupFeatureServices> =
  ({
     registers: {
       setupCallbacks,
     },
     registerList,
     logger,
   }) => {

    return {
      ...setupCallbacks('setupEventSourcing'),

      commandHandlers: registerList(),
      queryHandlers: registerList(),
      eventListeners: registerList(),
      domainEventStreamDecorators: registerList(),
      commandBus(): CommandBus {
        return new SimpleCommandBus();
      },

      queryBus(): QueryBus {
        return new SimpleQueryBus();
      },

      domainEventStreamDecorator(): AggregateDomainEventStreamDecorator {
        return new AggregateDomainEventStreamDecorator(this.domainEventStreamDecorators());
      },

      replayService() {
        return new ReplayService(
          this.eventStore(),
          this.domainEventBus(),
        );
      },

      eventStore(): EventStore {
        return new InMemoryEventStore();
      },

      domainEventBus(): AsynchronousEventBus {
        const errorLogger = new PrefixLogger(logger(), 'domainEventBus');
        return new AsynchronousEventBus((e) => {
          errorLogger.error(e);
        });
      },

      setupEventSourcing() {
        return async () => {
          this.commandHandlers().forEach((handler) => {
            this.commandBus().subscribe(handler);
          });

          this.eventListeners().forEach((listener) => {
            this.domainEventBus().subscribe(listener);
          });
          this.queryHandlers().forEach((listener) => {
            this.queryBus().subscribe(listener);
          });
        };
      },
    };

  };
