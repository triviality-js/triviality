import { Container } from '@triviality/core';
import { ServiceContainerConsumer } from '@triviality/react/ServiceContainerConsumer';
import { ServiceContainerProvider } from '@triviality/react/ServiceContainerProvider';
import 'babel-polyfill';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';
import { RoutesConnected } from './App/Component/RoutesConnected';
import { ChatReduxFeature } from './ChatReduxFeature';
import { serviceContainerFactory } from './ServiceContainer';

ReactDOM.render(
  (
    <ServiceContainerProvider
      factory={serviceContainerFactory().build()}
    >
      <ServiceContainerConsumer>{(container: Container<ChatReduxFeature>) =>
        <Provider store={container.store()}>
          <Router>
            <RoutesConnected />
          </Router>
        </Provider>
      }</ServiceContainerConsumer>
    </ServiceContainerProvider>
  ),
  document.getElementById('app'),
);
