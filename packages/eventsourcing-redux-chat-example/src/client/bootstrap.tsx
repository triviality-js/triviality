import 'babel-polyfill';
import '../../style/style.scss';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { gatewayOpen } from 'eventsourcing-redux-bridge/Gateway/actions';
import { Provider } from 'react-redux';
import { RoutesConnected } from './App/Component/RoutesConnected';
import { triviality } from 'triviality';
import { CommonModule } from '../shared/CommonModule';
import { BrowserRouter as Router } from 'react-router-dom';
import { ReduxModule } from './ReduxModule';

triviality()
  .add(CommonModule)
  .add(ReduxModule)
  .build()
  .then((container) => {
    const store = container.store();

    ReactDOM.render(
      (
        <Provider store={store}>
          <Router>
            <RoutesConnected/>
          </Router>
        </Provider>
      ) as any,
      document.getElementById('app') as any,
    );

    store.dispatch(gatewayOpen('bootstrap', '/chat'));
  });
