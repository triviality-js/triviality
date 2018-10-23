import 'source-map-support/register'
import { chatReducer } from '../shared/Reducer/chatReducer';
import { ChannelState } from '../shared/State/ChannelState';
import { ChatChannelId } from '../shared/ValueObject/ChatChannelId';
import { createSerializer } from '../shared/createSerializer';
import { ChatChannelAggregateRepository } from './Aggregate/ChatChannelAggregateRepository';
import { UserAggregateRepository } from './Aggregate/UserAggregateRepository';
import { UserRegisterCommandHandler } from './CommandHandler/UserRegisterCommandHandler';
import { ChatChannelCommandHandler } from './CommandHandler/ChatChannelCommandHandler';
import { default as express } from 'express';
import { default as http } from 'http';
import { default as socketIo, Socket } from 'socket.io';
import { ReduxChatProjector } from './Projector/ReduxChatProjector';
import * as React from 'react';
import { renderToString } from 'react-dom/server';
import * as path from 'path';
import { SimpleCommandBus } from 'ts-eventsourcing/CommandHandling/SimpleCommandBus';
import { SimpleStoreFactory } from 'eventsourcing-redux-bridge/Redux/Store/SimpleStoreFactory';
import { InMemoryEventStore } from 'ts-eventsourcing/EventStore/InMemoryEventStore';
import { InMemoryRepository } from 'ts-eventsourcing/ReadModel/InMemoryRepository';
import { StoreFactory } from 'eventsourcing-redux-bridge/Redux/Store/StoreFactory';
import { DomainEventBus } from 'ts-eventsourcing/EventHandling/DomainEventBus';
import { ConsoleLogger } from 'ts-eventsourcing/Logger/ConsoleLogger';
import { AsynchronousDomainEventBus } from 'ts-eventsourcing/EventHandling/DomainEventBus/AsynchronousDomainEventBus';
import { CommandBus } from 'ts-eventsourcing/CommandHandling/CommandBus';
import { LoggerInterface } from 'ts-eventsourcing/Logger/LoggerInterface';
import { ClientLogger } from './Logger/SocketClientLogger';
import { ServerSocketIOGateway } from 'eventsourcing-redux-bridge/Gateway/socket.io/ServerSocketIOGateway';
import { tap, catchError } from 'rxjs/operators';
import { ClassUtil } from 'ts-eventsourcing/ClassUtil';
import { Layout } from '../client/App/Component/Layout';
import { AppStoreFactory } from '../client/AppStoreFactory';
import { ProjectorGateway } from 'eventsourcing-redux-bridge/ReadModel/ProjectorGateway';
import { dispatchClientCommandOnCommandBus } from 'eventsourcing-redux-bridge/CommandHandling/Operator/dispatchClientCommandOnCommandBus';
import { StoreRepository } from 'eventsourcing-redux-bridge/ReadModel/Repository/StoreRepository';
import { StoreRepositoryInterface } from 'eventsourcing-redux-bridge/ReadModel/StoreRepositoryInterface';
import { emitCommandHandlerResponseOrErrorToClientGateway } from 'eventsourcing-redux-bridge/CommandHandling/Operator/emitCommandHandlerResponseOrErrorToClientGateway';
import { SocketIoGatewayFactory } from './SocketIoGatewayFactory';
import { accountReducer } from '../client/Account/accountReducer';
import { ACCOUNT_ENTITY_NAME } from '../client/Account/actions';
import { AccountGatewayProjector } from './Projector/AccountGatewayProjector';
import { AccountState } from '../client/Account/AcountState';
import { UserId } from '../shared/ValueObject/UserId';
import { SerializableAction } from 'eventsourcing-redux-bridge/Redux/SerializableAction';


// Utils.
const logger: LoggerInterface = new ConsoleLogger(console);

function getClientLogger(client: Socket): LoggerInterface {
  return ClientLogger.create(logger, client);
}

const serializer = createSerializer();

// Event sourcing infrastructure.
const commandBus: CommandBus = new SimpleCommandBus();
const eventBus: DomainEventBus = new AsynchronousDomainEventBus((e) => {
  // Domain event bus errors.
  logger.error(e);
});

// Aggregate repositories.
const chatChannelAggregateRepository: ChatChannelAggregateRepository = new ChatChannelAggregateRepository(
  new InMemoryEventStore(),
  eventBus,
);

const userAggregateRepository: UserAggregateRepository = new UserAggregateRepository(
  new InMemoryEventStore(),
  eventBus,
);

// Command handlers.
commandBus.subscribe(new UserRegisterCommandHandler(userAggregateRepository));
commandBus.subscribe(new ChatChannelCommandHandler(chatChannelAggregateRepository));

// Read model repositories.
const storeFactory: StoreFactory<ChannelState> = new SimpleStoreFactory(chatReducer);
const chatChannelStoreRepository: StoreRepositoryInterface<ChannelState, ChatChannelId> = new StoreRepository(
  new InMemoryRepository(), storeFactory);

// Server gateway.
const app = express();
const server = new http.Server(app);
const socketServer = socketIo(server);
const publicPath = path.resolve(process.cwd(), 'dist', 'client');
const srcPath = path.resolve(process.cwd(), 'src');
logger.info('Serving following public directory: \n', [
  publicPath,
  srcPath
]);
app.use(express.static(publicPath));
app.use('/src', express.static(srcPath));

app.use('/semantic-ui-css', express.static(path.join(process.cwd(), 'node_modules', 'semantic-ui-css')));
// semantic-ui-css

const clientStoreFactory = new AppStoreFactory();

app.get('/', (_req, res) => {
  const store = clientStoreFactory.createForServer();

  const jsx = (<Layout store={store}/>);
  const reactDom = renderToString(jsx);
  res.writeHead(200, { 'Content-Type': 'text/html' });
  res.end(`
      <html>
      <head>
          <meta charset="utf-8">
          <title>Chat app</title>
          <link rel="stylesheet" href="/semantic-ui-css/semantic.min.css"/>
      </head>

      <body>
          <div id="app">${reactDom}</div>
          <script src="/vendors.js"></script>
          <script src="/runtime.js"></script>
          <script src="/client.js"></script>
      </body>
      </html>
`);
});

const chatServer = socketServer.of('/chat');

// Listen to gateway events.
const gateway = new ServerSocketIOGateway(chatServer, serializer);
gateway.connections().subscribe((message) => {
  getClientLogger(message.client).info('Connected');
});
gateway.disconnects().subscribe((message) => {
  getClientLogger(message.client).info('disconnected');
});
gateway.warnings().subscribe((message) => {
  logger.warn(message);
});
gateway
  .listen()
  .pipe(
    // Tap to see what commands is being received in
    tap((message) => {
      getClientLogger(message.metadata.client).info('Received command: ', ClassUtil.nameOffInstance(message.command));
    }),

    // Pass to command the command bus.
    emitCommandHandlerResponseOrErrorToClientGateway(
      dispatchClientCommandOnCommandBus(commandBus)
    ),

    catchError((error, observer) => {
      // Catch all errors related to the gateway, and try again.
      logger.error(error);
      return observer;
    })
  )
  .subscribe();

const accountRepository = new StoreRepository<AccountState, UserId, SerializableAction>(
  new InMemoryRepository(),
  new SimpleStoreFactory(accountReducer)
);
const accountGatewayFactory = new SocketIoGatewayFactory(
  socketServer,
  serializer,
  ACCOUNT_ENTITY_NAME,
  accountRepository,
);

// Projectors.
const chatProjectorGateway = new ProjectorGateway<ChannelState, ChatChannelId>(
  chatChannelStoreRepository,
  gateway,
  'register',
);
const reduxChatProjector = new ReduxChatProjector(
  chatProjectorGateway,
  chatChannelStoreRepository,
);
const accountGatewayProjector = new AccountGatewayProjector(accountRepository, accountGatewayFactory);

eventBus.subscribe(accountGatewayProjector);
eventBus.subscribe(reduxChatProjector);

// Start listing to the server.
server.listen(3000, () => {
  logger.info('listening on *:3000');
});
