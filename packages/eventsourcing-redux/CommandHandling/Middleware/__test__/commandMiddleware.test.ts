import { commandMiddleware } from '../commandMiddleware';
import { MiddlewareAPI } from 'redux';
import { commandTransmissionFailed, commandTransmittedSuccessfully, sendCommand } from '../../actions';
import { SerializableCommand } from '../../SerializableCommand';
import { ClientGatewayInterface } from '../../../Gateway/ClientGatewayInterface';

class TestCommand extends SerializableCommand {

}

it('Should ignore none command actions', () => {

  const gateway: ClientGatewayInterface | any = {};

  const api: MiddlewareAPI | any = {};

  const next = jest.fn();

  const action = { type: 'randomAction' };
  commandMiddleware(gateway)(api)(next)(action);
  expect(next).toBeCalledWith(action);
});

it('Should handle commands', async () => {

  const gateway: ClientGatewayInterface | any = {
    emit: jest.fn().mockResolvedValue(undefined),
  };

  const api: MiddlewareAPI | any = {
    dispatch: jest.fn(),
  };

  const next = jest.fn();
  const action = sendCommand(new TestCommand(), 'TEST', { foo: 'bar' });
  commandMiddleware(gateway)(api)(next)(action);

  await gateway.emit();
  expect(next).toBeCalledWith(action);
  expect(api.dispatch).toBeCalledWith(commandTransmittedSuccessfully(action.command, action.metadata.entity, action.metadata));

});

it('Should handle failed', async () => {

  const gateway: ClientGatewayInterface | any = {
    emit: jest.fn().mockRejectedValue('Some error'),
  };

  const api: MiddlewareAPI | any = {
    dispatch: jest.fn(),
  };

  const next = jest.fn();

  const action = sendCommand(new TestCommand(), 'TEST', { foo: 'bar' });
  commandMiddleware(gateway)(api)(next)(action);

  await expect(gateway.emit()).rejects.toEqual('Some error');
  expect(next).toBeCalledWith(action);
  expect(api.dispatch).toBeCalledWith(commandTransmissionFailed(action.command, action.metadata.entity, 'Some error', {
    ...action.metadata,
  }));

});
