import 'source-map-support/register'
import {chatReducer} from '../shared/Reducer/chatReducer';
import {ChannelState} from '../shared/State/ChannelState';
import {ChatChannelId} from '../shared/ValueObject/ChatChannelId';
import {createSerializer} from '../shared/createSerializer';
import {ChatChannelAggregateRepository} from './Aggregate/ChatChannelAggregateRepository';
import {UserAggregateRepository} from './Aggregate/UserAggregateRepository';
import {UserRegisterCommandHandler} from './CommandHandler/UserRegisterCommandHandler';
import {ChatChannelCommandHandler} from './CommandHandler/ChatChannelCommandHandler';
import {default as express} from 'express';
import {default as http} from 'http';
import {default as socketIo, Socket} from 'socket.io';
import {ReduxChatProjector} from './Projector/ReduxChatProjector';
import * as path from 'path';
import {SimpleCommandBus} from 'ts-eventsourcing/CommandHandling/SimpleCommandBus';
import {SimpleStoreFactory} from 'eventsourcing-redux-bridge/Redux/Store/SimpleStoreFactory';
import {InMemoryRepository} from 'ts-eventsourcing/ReadModel/InMemoryRepository';
import {DomainEventBus} from 'ts-eventsourcing/EventHandling/DomainEventBus';
import {ConsoleLogger} from 'ts-eventsourcing/Logger/ConsoleLogger';
import {AsynchronousDomainEventBus} from 'ts-eventsourcing/EventHandling/DomainEventBus/AsynchronousDomainEventBus';
import {CommandBus} from 'ts-eventsourcing/CommandHandling/CommandBus';
import {LoggerInterface} from 'ts-eventsourcing/Logger/LoggerInterface';
import {ClientLogger} from './Logger/SocketClientLogger';
import {ServerSocketIOGateway} from 'eventsourcing-redux-bridge/Gateway/socket.io/ServerSocketIOGateway';
import {tap, catchError, share} from 'rxjs/operators';
import {ClassUtil} from 'ts-eventsourcing/ClassUtil';
import {dispatchClientCommandOnCommandBus} from 'eventsourcing-redux-bridge/CommandHandling/Operator/dispatchClientCommandOnCommandBus';
import {StoreRepository} from 'eventsourcing-redux-bridge/ReadModel/Repository/StoreRepository';
import {StoreRepositoryInterface} from 'eventsourcing-redux-bridge/ReadModel/StoreRepositoryInterface';
import {emitCommandHandlerResponseOrErrorToClientGateway} from 'eventsourcing-redux-bridge/CommandHandling/Operator/emitCommandHandlerResponseOrErrorToClientGateway';
import {accountReducer} from '../client/Account/accountReducer';
import {AccountState} from '../client/Account/AcountState';
import {UserId} from '../shared/ValueObject/UserId';
import {emitQueryHandlerResponseOrErrorToClientGateway} from 'eventsourcing-redux-bridge/QueryHandling/Operator/emitQueryHandlerResponseOrErrorToClientGateway';
import {dispatchClientQueryOnQueryBus} from 'eventsourcing-redux-bridge/QueryHandling/Operator/dispatchClientQueryOnQueryBus';
import {QueryBus} from 'ts-eventsourcing/QueryHandling/QueryBus';
import {SimpleQueryBus} from 'ts-eventsourcing/QueryHandling/SimpleQueryBus';
import {merge} from 'rxjs';
import {ReadModelAction} from 'eventsourcing-redux-bridge/ReadModel/ReadModelAction';
import {SocketIoGatewayFactory} from "eventsourcing-redux-bridge/Gateway/socket.io/SocketIoGatewayFactory";
import {combineClientChain} from "eventsourcing-redux-bridge/Gateway/ClientConnectionChain";
import {SocketConnection} from "eventsourcing-redux-bridge/Gateway/socket.io/ValueObject/SocketConnection";
import {SimpleProjectorGateway} from "eventsourcing-redux-bridge/ReadModel/Projector/SimpleProjectorGateway";
import {AccountGatewayFactory} from "./Projector/Gateway/AccountGatewayFactory";
import {createStateQueryHandler} from "./QueryHandler/StateQueryHandler";
import {ActionWithSnapshotRepository} from "eventsourcing-redux-bridge/ReadModel/Repository/ActionWithSnapshotRepository";
import {InMemoryActionRepository} from "eventsourcing-redux-bridge/ReadModel/Repository/InMemoryActionRepository";
import {QueryAccountState} from "./Query/QueryAccountState";
import {FileEventStore} from "ts-eventsourcing/EventStore/FileEventStore";
import { AccountProjector } from "./Projector/AccountProjector";

// Utils.
const logger: LoggerInterface = new ConsoleLogger(console);

function getClientLogger(client: Socket): LoggerInterface {
    return ClientLogger.create(logger, client);
}

const serializer = createSerializer();

// CQRS infrastructure.
const commandBus: CommandBus = new SimpleCommandBus();
const eventBus: DomainEventBus = new AsynchronousDomainEventBus((e) => {
    // Domain event bus errors.
    logger.error(e);
});
const queryBus: QueryBus = new SimpleQueryBus();

const eventStore = FileEventStore.fromFile('events.json', serializer);

// Aggregate repositories.
const chatChannelAggregateRepository: ChatChannelAggregateRepository = new ChatChannelAggregateRepository(
    eventStore,
    eventBus,
);

const userAggregateRepository: UserAggregateRepository = new UserAggregateRepository(
    eventStore,
    eventBus,
);

// Command handlers.
commandBus.subscribe(new UserRegisterCommandHandler(userAggregateRepository));
commandBus.subscribe(new ChatChannelCommandHandler(chatChannelAggregateRepository));

// Read model repositories.
const storeFactory = new SimpleStoreFactory<ChannelState, ReadModelAction<ChatChannelId>>(chatReducer);
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
          <div id="app"></div>
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
        // See what queries/commands are being received.
        tap((message) => {
            getClientLogger(message.metadata.client).info('Received message: ', ClassUtil.nameOffInstance(message.payload));
        }),
        share(),
        ((messages$) => {
            return merge(
                messages$
                    .pipe(
                        emitCommandHandlerResponseOrErrorToClientGateway(
                            dispatchClientCommandOnCommandBus(commandBus)
                        ),
                    ),
                messages$
                    .pipe(
                        emitQueryHandlerResponseOrErrorToClientGateway(responses$ => responses$.pipe(
                            dispatchClientQueryOnQueryBus(queryBus),
                        )),
                    )
            )
        }),
        catchError((error, observer) => {
            // Catch all errors related to the gateway, and try again.
            logger.error(error);
            return observer;
        })
    ).subscribe();

const accountStoreFactory = new SimpleStoreFactory<AccountState, ReadModelAction<UserId>>(accountReducer);
const accountRepository = new ActionWithSnapshotRepository<AccountState, UserId>(
    new InMemoryActionRepository(accountStoreFactory),
    new StoreRepository<AccountState, UserId>(
        new InMemoryRepository(),
        accountStoreFactory
    ),
);

const gatewayForAccountFactory = new SocketIoGatewayFactory<AccountState, UserId>(
    socketServer,
    serializer,
    accountRepository,
    combineClientChain(
        (next) => (connection: SocketConnection) => {
            if (connection) {
                // connection.client.handshake.
                //throw new Error('No permission');
            }
            next(connection);
        },
    )
);


// Query handlers
queryBus.subscribe(createStateQueryHandler<QueryAccountState, AccountState, UserId>(
    QueryAccountState,
    accountRepository
));

// Projectors.
const chatProjectorGateway = new SimpleProjectorGateway<ChannelState, ChatChannelId>(
    chatChannelStoreRepository,
    gateway,
);
const reduxChatProjector = new ReduxChatProjector(
    chatProjectorGateway,
    chatChannelStoreRepository,
);

const accountGatewayProjector = new AccountProjector(new AccountGatewayFactory(gatewayForAccountFactory));

eventBus.subscribe(accountGatewayProjector);
eventBus.subscribe(reduxChatProjector);

// Start listing to the server.
server.listen(3000, () => {
    logger.info('listening on *:3000');
});
