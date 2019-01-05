import { Container, Module } from 'triviality';
import { CommandHandler } from 'ts-eventsourcing/CommandHandling/CommandHandler';
import { EventListener } from 'ts-eventsourcing/EventHandling/EventListener';
import { LoggerModule } from "triviality-logger/Module/LoggerModule";
import { CommonModule } from "../shared/CommonModule";
import { default as express, Express } from "express";
import * as http from "http";
import * as path from "path";
import { default as socketIo } from 'socket.io';
import { ServerSocketIOGateway } from "eventsourcing-redux-bridge/Gateway/socket.io/ServerSocketIOGateway";

export class WebModule implements Module {

    constructor(private container: Container<LoggerModule, CommonModule>) {
    }

    public registries() {
        return {
            commandHandlers: (): CommandHandler[] => {
                return [];
            },
            eventListeners: (): EventListener[] => {
                return [];
            },
        };
    }

    public async setup() {
        const logger = this.container.logger();
        const publicPath = path.resolve(process.cwd(), 'dist', 'client');
        const srcPath = path.resolve(process.cwd(), 'src');
        logger.info('Serving following public directory: \n', [
            publicPath,
            srcPath
        ]);
        const app = this.expressApp();
        app.use(express.static(publicPath));
        app.use('/src', express.static(srcPath));

        app.use('/semantic-ui-css', express.static(path.join(process.cwd(), 'node_modules', 'semantic-ui-css')));
// semantic-ui-css

        app.get('/', (_req, res) => {
            res.writeHead(200, {'Content-Type': 'text/html'});
            res.end(`
      <html>
      <head>
          <meta charset="utf-8">
          <title>Chat app</title>
          <link rel="stylesheet" href="/semantic-ui-css/semantic.min.css"/>
      </head>

      <body>
          <div id="app">Moment please..</div>
          <script src="/vendors.js"></script>
          <script src="/runtime.js"></script>
          <script src="/client.js"></script>
      </body>
      </html>
`);
        });


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
