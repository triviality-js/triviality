import * as React from 'react';
import { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import { LoginForm } from '../../Account/Component/LoginForm';
import { LogoutForm } from '../../Account/Component/LogoutForm';
import { RegisterForm } from '../../Account/Component/RegisterForm';
import { Index } from './Index';

export function LoggedInRoutes() {
  return (
    <Switch>
      <Route path="/" exact={true} component={Index} />
      <Route path="/logout" component={LogoutForm} />
      <Route component={Index} />
    </Switch>
  );
}

export function NotLoggedInRoutes() {
  return (
    <Switch>
      <Route exact path="/" component={LoginForm} />
      <Route path="/login" component={LoginForm} />
      <Route path="/register" component={RegisterForm} />
      <Route component={LoginForm} />
    </Switch>
  );
}

export class Routes extends Component<{ loggedIn: boolean }> {
  public render() {
    return this.props.loggedIn ? <LoggedInRoutes /> : <NotLoggedInRoutes />;
  }
}
