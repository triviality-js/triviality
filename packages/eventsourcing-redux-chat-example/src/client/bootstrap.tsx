import 'babel-polyfill';

import { Container, triviality } from '@triviality/core';
import { DefaultLoggerFeature } from '@triviality/logger';
import { ServiceContainerConsumer } from '@triviality/react/ServiceContainerConsumer';
import { ServiceContainerProvider } from '@triviality/react/ServiceContainerProvider';
import { TransitJsSerializerFeature } from '@triviality/serializer/transit-js';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';
import { CommonFeature } from '../shared/CommonFeature';
import { AccountFeature } from './Account/AccountFeature';
import { AppFeature } from './App/AppFeature';
import { RoutesConnected } from './App/Component/RoutesConnected';
import { ChatReduxFeature } from './ChatReduxFeature';

ReactDOM.render(
  (
    <ServiceContainerProvider
      factory={
        triviality()
          .add(DefaultLoggerFeature)
          .add(TransitJsSerializerFeature)
          .add(CommonFeature)
          .add(ChatReduxFeature)
          .add(AccountFeature)
          .add(AppFeature)
          .build()
      }
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
