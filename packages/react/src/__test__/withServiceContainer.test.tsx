import * as React from 'react';
import * as renderer from 'react-test-renderer';
import { ServiceContainerProvider } from '../ServiceContainerProvider';
import { withServiceContainer } from '../withServiceContainer';

it('Connect to service container', (done) => {
  const mockConsumer = jest.fn();
  mockConsumer.mockReturnValue(<div>Dummy</div>);
  const Component = withServiceContainer(({ serviceContainer }: { serviceContainer: { hi: string } }) => {
    expect(serviceContainer.hi).toBe('john');
    done();

    return <div />;
  });
  renderer.create((
    <ServiceContainerProvider factory={Promise.resolve({ hi: 'john' })}><Component /></ServiceContainerProvider>
  ));
});
