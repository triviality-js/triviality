import { Container, Module } from 'triviality';
import { LoggerModule } from 'triviality-logger/Module/LoggerModule';
import { CommonModule } from '../shared/CommonModule';
import { default as express, Express } from 'express';
import * as http from 'http';
import * as path from 'path';
import { default as socketIo } from 'socket.io';
import { ServerSocketIOGateway } from 'eventsourcing-redux-bridge/Gateway/socket.io/ServerSocketIOGateway';
import { CommanderConfigurationInterface } from 'triviality-commander';
import { ServerCommanderCommand } from './Cli/ServerCommanderCommand';
import { EventSourcingModule } from './EventSourcingModule';
import { IndexController } from './Controller/IndexController';

export class WebModule implements Module {

  constructor(private container: Container<LoggerModule, CommonModule, EventSourcingModule>) {
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
