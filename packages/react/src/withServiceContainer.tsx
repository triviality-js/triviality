import * as React from 'react';
import { ComponentClass, FunctionComponent } from 'react';
import { Omit } from '@triviality/core';
import { ServiceContainerConsumer } from './ServiceContainerConsumer';

export interface WithServiceContainerProps<T> {
  serviceContainer: T;
}

export function withServiceContainer<TOwnProps extends WithServiceContainerProps<Container>, Container>(Component: ComponentClass<TOwnProps> | FunctionComponent<TOwnProps>) {
  return function ServiceContainer(props: Omit<TOwnProps, 'serviceContainer'>) {
    const Inter: any = Component;
    return (
      <ServiceContainerConsumer>
        {(container: Container) => {
          return <Inter serviceContainer={container} {...props} />;
        }}
      </ServiceContainerConsumer>
    );
  };
}
