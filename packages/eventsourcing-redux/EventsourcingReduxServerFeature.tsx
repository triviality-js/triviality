import { CommanderConfigurationInterface } from '@triviality/commander';
import { Container, Feature, OptionalContainer } from '@triviality/core';
import { ServerSocketIOGateway } from '@triviality/eventsourcing-redux/Gateway/socket.io/ServerSocketIOGateway';
import { EventSourcingFeature } from '@triviality/eventsourcing/EventSourcingFeature';
import { EventStore } from '@triviality/eventsourcing/EventStore/EventStore';
import { FileEventStore } from '@triviality/eventsourcing/EventStore/FileEventStore';
import { LoggerFeature } from '@triviality/logger';
import { SerializerFeature } from '@triviality/serializer';
import { default as express, Express } from 'express';
import expressSession from 'express-session';
import sharedSession from 'express-socket.io-session';
import * as http from 'http';
import * as path from 'path';
import { default as socketIo } from 'socket.io';
import { ServerCommanderCommand } from './Cli/ServerCommanderCommand';

export class EventsourcingReduxServerFeature implements Feature {

  constructor(private container: Container<LoggerFeature, SerializerFeature, EventSourcingFeature>) {
  }

  public registries() {
    return {
      commanderConfigurations: (): CommanderConfigurationInterface[] => {
        return [
          new ServerCommanderCommand(
            this.httpServer(),
            3000,
            this.serverGateway(),
            this.container.logger(),
            this.container.commandBus(),
            this.container.queryBus(),
          ),
        ];
      },
    };
  }

  public serviceOverrides(): OptionalContainer<EventSourcingFeature> {
    return {
      eventStore: (): EventStore => {
        return FileEventStore.fromFile('events.json', this.container.serializer());
      },
    };
  }

  public async setup() {
    const publicPath = path.resolve(process.cwd(), 'dist', 'client');
    const srcPath = path.resolve(process.cwd(), 'src');
    const app = this.expressApp();
    const io = this.socketServer();
    app.use(express.static(publicPath));
    app.use('/src', express.static(srcPath));

    const session = expressSession({
      secret: this.appSecret(),
      resave: true,
      saveUninitialized: true,
    });

    // Use express-session middleware for express
    app.use(session);

    // Use shared session middleware for socket.io
    // setting autoSave:true
    io.use(sharedSession(session, {
      autoSave: true,
    }) as any);
  }

  public appSecret(): string {
    const appsecret = process.env.APP_SECRET as unknown;
    if (process.env.NODE_ENV === 'development' && !appsecret) {
      this.container.logger().info('Running in development mode, Using no given secret');
      return 'not-so-secret';
    }
    if (typeof appsecret !== 'string' || !appsecret) {
      throw new Error('APP_SECRET should be defined');
    }
    return appsecret;
  }

  public expressApp(): Express {
    return express();
  }

  public httpServer(): http.Server {
    return new http.Server(this.expressApp());
  }

  public socketServer(): socketIo.Server {
    return socketIo(this.httpServer());
  }

  public serverGateway(): ServerSocketIOGateway {
    const chatServer = this.socketServer().of('/cqs');
    return new ServerSocketIOGateway(chatServer, this.container.serializer());
  }

}
