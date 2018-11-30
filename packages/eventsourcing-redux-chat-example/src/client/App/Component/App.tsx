import * as React from 'react';
import { PureComponent } from 'react';
import { Provider } from 'react-redux';
import { AppStore } from '../../AppStore';
import { Layout } from "./Layout";

export class App extends PureComponent<{ store: AppStore }> {
  public render() {
    return (
      <Provider store={this.props.store}>
        <Layout/>
      </Provider>
    );
  };
}
