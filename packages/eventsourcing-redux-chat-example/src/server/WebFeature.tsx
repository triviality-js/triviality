import { CommanderConfigurationInterface } from '@triviality/commander';
import { Container, Feature } from '@triviality/core';
import { ServerSocketIOGateway } from '@triviality/eventsourcing-redux/Gateway/socket.io/ServerSocketIOGateway';
import { LoggerFeature } from '@triviality/logger';
import { SerializerFeature } from '@triviality/serializer';
import { default as express, Express } from 'express';
import * as http from 'http';
import * as path from 'path';
import { default as socketIo } from 'socket.io';
import { ServerCommanderCommand } from './Cli/ServerCommanderCommand';
import { IndexController } from './Controller/IndexController';
import { EventSourcingFeature } from './EventSourcingFeature';

export class WebFeature implements Feature {

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

  public async setup() {
    const publicPath = path.resolve(process.cwd(), 'dist', 'client');
    const srcPath = path.resolve(process.cwd(), 'src');
    const app = this.expressApp();
    app.use(express.static(publicPath));
    app.use('/src', express.static(srcPath));
    app.use('/semantic-ui-css', express.static(path.join(process.cwd(), 'node_modules', 'semantic-ui-css')));
    app.get('*', this.indexController().action.bind(this.indexController()));
  }

  public indexController() {
    return new IndexController();
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
    const chatServer = this.socketServer().of('/chat');
    return new ServerSocketIOGateway(chatServer, this.container.serializer());
  }

}
