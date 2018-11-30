import 'babel-polyfill';
import '../../style/style.scss';
import * as socketIo from 'socket.io-client';
import { createSerializer } from '../shared/createSerializer';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { ClientSocketIOGateway } from 'eventsourcing-redux-bridge/Gateway/socket.io/ClientSocketIOGateway';
import { SerializerInterface } from 'eventsourcing-redux-bridge/Serializer/SerializerInterface';
import { AppStoreFactory } from './AppStoreFactory';
import { gatewayOpen } from 'eventsourcing-redux-bridge/Gateway/actions';
import { App } from "./App/Component/App";

// Utils.
const serializer: SerializerInterface = createSerializer();
const storeFactory = new AppStoreFactory();

const sockets: {[name: string]: ClientSocketIOGateway} = {};

const store = storeFactory.createForClient((path: string) => {
  if (sockets[path]) {
    return sockets[path];
  }
  const socket = socketIo.connect('http://localhost:3000' + path);
  sockets[path] = new ClientSocketIOGateway(socket, serializer);
  return sockets[path];
});

ReactDOM.hydrate(
  <App store={store}/>,
  document.getElementById('app'),
);

store.dispatch(gatewayOpen('bootstrap', '/chat'));
