import * as React from 'react';
import { ReactNode } from 'react';
import { ServiceContainerContext, ServiceContainerContextValue } from './ServiceContainerProvider';

export type ServiceContainerConsumeCallback<T> = (serviceContainer: T) => ReactNode;

export interface HttpClientConsumerProps<T> {
  children: ServiceContainerConsumeCallback<T>;
}

export class ServiceContainerConsumer<T> extends React.PureComponent<HttpClientConsumerProps<T>> {

  public render(): React.ReactNode {
    return (
      <ServiceContainerContext.Consumer>
        {this.handleConsumeCallback}
      </ServiceContainerContext.Consumer>
    );
  }

  private handleConsumeCallback = (value: ServiceContainerContextValue<T>): ReactNode => {
    const { children } = this.props;
    if (!value || !value.serviceContainer) {
      throw new Error('No provider found for service container');
    }
    return children(value.serviceContainer as T);
  };

}
