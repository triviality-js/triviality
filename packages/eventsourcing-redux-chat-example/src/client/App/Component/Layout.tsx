import * as React from 'react';
import { PureComponent } from 'react';
import { connect, Provider } from 'react-redux';
import { RegisterForm } from "../../Account/Component/RegisterForm";
import { AppState } from "../AppState";

export const Layout = connect((appState: AppState) => {
  return {
    loggedIn: appState.loggedIn,
  };
})(
  class Layout extends PureComponent {
    public render() {
      return (
        <Provider store={this.props.store}>
          <RegisterForm/>
        </Provider>
      );
    };
  }
);
