import { CommandBus } from 'ts-eventsourcing/CommandHandling/CommandBus';
import { SimpleCommandBus } from 'ts-eventsourcing/CommandHandling/SimpleCommandBus';
import { AsynchronousDomainEventBus } from 'ts-eventsourcing/EventHandling/DomainEventBus/AsynchronousDomainEventBus';
import { QueryBus } from 'ts-eventsourcing/QueryHandling/QueryBus';
import { SimpleQueryBus } from 'ts-eventsourcing/QueryHandling/SimpleQueryBus';
import { Container, Module } from 'triviality';
import { AggregateDomainEventStreamDecorator } from 'ts-eventsourcing/Domain/Decorator/AggregateDomainEventStreamDecorator';
import { CommandHandler } from 'ts-eventsourcing/CommandHandling/CommandHandler';
import { EventListener } from 'ts-eventsourcing/EventHandling/EventListener';
import { LoggerModule } from "triviality-logger/Module/LoggerModule";
import { PrefixLogger } from "triviality-logger/PrefixLogger";
import { FileEventStore } from "ts-eventsourcing/EventStore/FileEventStore";
import { CommonModule } from "../shared/CommonModule";
import { EventStore } from "ts-eventsourcing/EventStore/EventStore";
import { QueryHandler } from "ts-eventsourcing/QueryHandling/QueryHandler";

export class EventSourcingModule implements Module {

    constructor(private container: Container<LoggerModule, CommonModule>) {
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
        return new AggregateDomainEventStreamDecorator([]);
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
