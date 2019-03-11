import * as React from 'react';
import * as renderer from 'react-test-renderer';
import { ServiceContainerProvider } from '../ServiceContainerProvider';
import { ServiceContainerConsumer } from '../ServiceContainerConsumer';

it('Able to nest providers', (done) => {
  const serviceContainer1 = { hi: 'test' };
  const serviceContainer2 = { bye: 'test' };
  renderer.create((
    <ServiceContainerProvider factory={Promise.resolve(serviceContainer1)}>
      <ServiceContainerProvider factory={Promise.resolve(serviceContainer2)}>
        <ServiceContainerConsumer>{
          (container) => {
            expect(container).toBe(serviceContainer1);
            done();
            return <div />;
          }
        }</ServiceContainerConsumer>
      </ServiceContainerProvider>
    </ServiceContainerProvider>
  ));
});

it('Handle errors in boundary', (done) => {

  class ErrorBoundary extends React.Component {
    public state = { hasError: false };

    public componentDidCatch(error: unknown) {
      expect(error).toBe('someCriticalError');
      done();
    }

    public render() {
      if (this.state.hasError) {
        // You can render any custom fallback UI
        return <h1>Something went wrong.</h1>;
      }
      return this.props.children;
    }
  }
  renderer.create((
    <ErrorBoundary>
      <ServiceContainerProvider factory={Promise.reject('someCriticalError')}>
        test
      </ServiceContainerProvider>
    </ErrorBoundary>
  ));
});
