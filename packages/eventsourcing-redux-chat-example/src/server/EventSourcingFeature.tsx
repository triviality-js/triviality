import { Container, Feature } from '@triviality/core';
import { CommandBus } from '@triviality/eventsourcing/CommandHandling/CommandBus';
import { CommandHandler } from '@triviality/eventsourcing/CommandHandling/CommandHandler';
import { SimpleCommandBus } from '@triviality/eventsourcing/CommandHandling/SimpleCommandBus';
import { AggregateDomainEventStreamDecorator } from '@triviality/eventsourcing/Domain/Decorator/AggregateDomainEventStreamDecorator';
import { DomainEventStreamDecorator } from '@triviality/eventsourcing/Domain/DomainEventStreamDecorator';
import { AsynchronousDomainEventBus } from '@triviality/eventsourcing/EventHandling/DomainEventBus/AsynchronousDomainEventBus';
import { EventListener } from '@triviality/eventsourcing/EventHandling/EventListener';
import { EventStore } from '@triviality/eventsourcing/EventStore/EventStore';
import { FileEventStore } from '@triviality/eventsourcing/EventStore/FileEventStore';
import { QueryBus } from '@triviality/eventsourcing/QueryHandling/QueryBus';
import { QueryHandler } from '@triviality/eventsourcing/QueryHandling/QueryHandler';
import { SimpleQueryBus } from '@triviality/eventsourcing/QueryHandling/SimpleQueryBus';
import { ReplayService } from '@triviality/eventsourcing/ReplayService';
import { LoggerFeature } from '@triviality/logger';
import { PrefixLogger } from '@triviality/logger/PrefixLogger';
import { SerializerFeature } from '@triviality/serializer';

export class EventSourcingFeature implements Feature {

  constructor(private container: Container<LoggerFeature, SerializerFeature>) {
  }

  public registries() {
    return {
      commandHandlers: (): CommandHandler[] => {
        return [];
      },
      queryHandlers: (): QueryHandler[] => {
        return [];
      },
      eventListeners: (): EventListener[] => {
        return [];
      },
      domainEventStreamDecorators: (): DomainEventStreamDecorator[] => {
        return [];
      },
    };
  }

  public async setup() {
    const handlers = await this.registries().commandHandlers();
    handlers.forEach((handler) => {
      this.commandBus().subscribe(handler);
    });

    const listeners = await this.registries().eventListeners();
    listeners.forEach((listener) => {
      this.domainEventBus().subscribe(listener);
    });

    const queryHandler = await this.registries().queryHandlers();
    queryHandler.forEach((listener) => {
      this.queryBus().subscribe(listener);
    });

    await this.replayService().replay();
  }

  public commandBus(): CommandBus {
    return new SimpleCommandBus();
  }

  public queryBus(): QueryBus {
    return new SimpleQueryBus();
  }

  public domainEventStreamDecorator(): AggregateDomainEventStreamDecorator {
    return new AggregateDomainEventStreamDecorator(this.registries().domainEventStreamDecorators());
  }

  public replayService() {
    return new ReplayService(
      this.eventStore(),
      this.domainEventBus(),
    );
  }

  public eventStore(): EventStore {
    return FileEventStore.fromFile('events.json', this.container.serializer());
  }

  public domainEventBus(): AsynchronousDomainEventBus {
    const logger = new PrefixLogger(this.container.logger(), 'domainEventBus');
    return new AsynchronousDomainEventBus((e) => {
      logger.error(e);
    });
  }

}
