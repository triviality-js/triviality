import { Container, Feature } from '@triviality/core';
import { LoggerFeature, PrefixLogger } from '@triviality/logger';
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

export class EventSourcingFeature implements Feature {

  constructor(protected container: Container<LoggerFeature>) {
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
    return new InMemoryEventStore();
  }

  public domainEventBus(): AsynchronousEventBus {
    const logger = new PrefixLogger(this.container.logger(), 'domainEventBus');
    return new AsynchronousEventBus((e) => {
      logger.error(e);
    });
  }

}
