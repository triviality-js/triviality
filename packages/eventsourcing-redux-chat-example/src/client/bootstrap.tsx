import 'babel-polyfill';
import '../../style/style.scss';
import * as socketIo from 'socket.io-client';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { ClientSocketIOGateway } from 'eventsourcing-redux-bridge/Gateway/socket.io/ClientSocketIOGateway';
import { AppStoreFactory } from './AppStoreFactory';
import { gatewayOpen } from 'eventsourcing-redux-bridge/Gateway/actions';
import { Provider } from 'react-redux';
import { Layout } from './App/Component/Layout';
import { ContainerFactory } from 'triviality';
import { CommonModule } from '../shared/CommonModule';

ContainerFactory
  .create()
  .add(CommonModule)
  .build()
  .then((container) => {
    // Utils.
    const storeFactory = new AppStoreFactory();

    const sockets: { [name: string]: ClientSocketIOGateway } = {};

    const store = storeFactory.createForClient((path: string) => {
      if (sockets[path]) {
        return sockets[path];
      }
      const socket = socketIo.connect(`http://localhost:3000${path}`);
      sockets[path] = new ClientSocketIOGateway(socket, container.serializer());
      return sockets[path];
    });

    ReactDOM.hydrate(
      (
        <Provider store={store}>
          <Layout/>
        </Provider>
      ),
      document.getElementById('app'),
    );

    store.dispatch(gatewayOpen('bootstrap', '/chat'));
  });
