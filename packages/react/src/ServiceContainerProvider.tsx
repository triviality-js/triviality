import * as React from 'react';
import { Context, ReactNode } from 'react';

export type ServiceContainerContextValue<T> = {
  serviceContainer: T;
} | null;

export const ServiceContainerContext: Context<ServiceContainerContextValue<any>> = React.createContext<ServiceContainerContextValue<any>>(
  null);

export interface ServiceContainerProviderProps<T> {
  children: ReactNode;
  factory: Promise<T>;
}

export interface ServiceContainerProviderState<T> {
  serviceContainer?: T;
  error: string | null;
}

/**
 * This ServiceContainerProvider can be nested with each other, passes to level container to all children.
 */
export class ServiceContainerProvider<T> extends React.PureComponent<ServiceContainerProviderProps<T>, ServiceContainerProviderState<T>> {

  public state: ServiceContainerProviderState<T> = {
    error: null,
  };

  public render(): React.ReactNode {
    const { children } = this.props;
    const { serviceContainer, error } = this.state;
    if (error) {
      throw error;
    }
    if (serviceContainer) {
      return (
        <ServiceContainerContext.Provider value={{ serviceContainer }}>{children}</ServiceContainerContext.Provider>);
    }
    return (
      <ServiceContainerContext.Consumer>
        {this.handleConsumeCallback}
      </ServiceContainerContext.Consumer>
    );
  }

  private handleConsumeCallback = (value: ServiceContainerContextValue<T>): ReactNode => {
    const { children, factory } = this.props;
    if (value && value.serviceContainer) {
      // We are a nested provider, so we can just return directly and let the parent provider handle the rest.
      return children;
    }
    factory
      .then((serviceContainer) => {
        this.setState({ serviceContainer });
      })
      .catch((error) => {
        this.setState({
          error,
        });
      });
    return null;
  };
}
