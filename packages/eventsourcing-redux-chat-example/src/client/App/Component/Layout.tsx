import * as React from 'react';
import { Component } from 'react';
import { Provider } from 'react-redux';
import { ConnectedRegisterForm } from '../../Account/Component/ConnectedRegisterForm';
import { AppStore } from '../../AppStore';

export class Layout extends Component<{ store: AppStore }> {
  public render() {
    return (
      <Provider store={this.props.store}>
        <ConnectedRegisterForm/>
      </Provider>
    );
  };
}
