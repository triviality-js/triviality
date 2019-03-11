import * as React from 'react';
import * as renderer from 'react-test-renderer';
import { ServiceContainerConsumer } from '../';

it('Should be able to create a provider', () => {
  const mockConsumer = jest.fn();
  mockConsumer.mockReturnValue(<div>Dummy</div>);
  expect(() => {
    renderer.create((
      <ServiceContainerConsumer>
        {mockConsumer}
      </ServiceContainerConsumer>
    ));
  }).toThrowError('No provider found for service container');
  expect(mockConsumer).not.toBeCalled();
});
