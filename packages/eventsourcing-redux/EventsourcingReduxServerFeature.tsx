import { CommanderConfigurationInterface, CommanderFeatureServices } from '@triviality/commander';
import { FF } from '@triviality/core';
import { ServerSocketIOGateway } from '@triviality/eventsourcing-redux/Gateway/socket.io/ServerSocketIOGateway';
import { EventSourcingFeatureServices } from '@triviality/eventsourcing/EventSourcingFeature';
import { LoggerFeatureServices } from '@triviality/logger';
import { SerializerFeatureServices } from '@triviality/serializer';
import { default as express, Express } from 'express';
import expressSession from 'express-session';
import sharedSession from 'express-socket.io-session';
import * as http from 'http';
import * as path from 'path';
import { default as socketIo } from 'socket.io';
import { ServerCommanderCommand } from './Cli/ServerCommanderCommand';

export interface EventsourcingReduxServerFeatureServices {
  reduxServerCommand: CommanderConfigurationInterface;

  configureApp: () => void;

  appSecret: string;

  expressApp: Express;
  httpServer: http.Server;

  socketServer: socketIo.Server;

  serverGateway: ServerSocketIOGateway;
}

export interface EventsourcingReduxServerFeatureDependencies extends LoggerFeatureServices, SerializerFeatureServices, EventSourcingFeatureServices, CommanderFeatureServices {

}

export const EventsourcingReduxServerFeature: FF<EventsourcingReduxServerFeatureServices, EventsourcingReduxServerFeatureDependencies> =
  ({
     logger,
     serializer,
     commandBus,
     queryBus,
     registers: { commanderConfigurations },
   }) => {

    commanderConfigurations('reduxServerCommand');

    return {
      configureApp() {
        return () => {
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
        };
      },
      reduxServerCommand() {
        return new ServerCommanderCommand(
          this.httpServer(),
          3000,
          this.serverGateway(),
          logger(),
          commandBus(),
          queryBus(),
        );
      },
      appSecret(): string {
        const appsecret = process.env.APP_SECRET as unknown;
        if (process.env.NODE_ENV === 'development' && !appsecret) {
          logger().info('Running in development mode, running without a given secret');
          return 'not-so-secret';
        }
        if (typeof appsecret !== 'string' || !appsecret) {
          throw new Error('APP_SECRET should be defined');
        }
        return appsecret;
      },

      expressApp(): Express {
        return express();
      },

      httpServer(): http.Server {
        return new http.Server(this.expressApp());
      },

      socketServer(): socketIo.Server {
        return socketIo(this.httpServer());
      },

      serverGateway(): ServerSocketIOGateway {
        const chatServer = this.socketServer().of('/cqs');
        return new ServerSocketIOGateway(chatServer, serializer());
      },
    };
  };
