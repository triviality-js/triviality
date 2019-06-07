import { queryMiddleware } from '../queryMiddleware';
import { MiddlewareAPI } from 'redux';
import { queryTransmissionFailed, queryTransmittedSuccessfully, sendQuery } from '../../actions';
import { SerializableQuery } from '../../SerializableQuery';
import { ClientGatewayInterface } from '../../../Gateway/ClientGatewayInterface';

class TestQuery extends SerializableQuery {

}

it('Should ignore none query actions', () => {

  const gateway: ClientGatewayInterface | any = {};

  const api: MiddlewareAPI | any = {};

  const next = jest.fn();

  const action = { type: 'randomAction' };
  queryMiddleware(gateway)(api)(next)(action);
  expect(next).toBeCalledWith(action);
});

it('Should handle queries', async () => {

  const gateway: ClientGatewayInterface | any = {
    emit: jest.fn().mockResolvedValue(undefined),
  };

  const api: MiddlewareAPI | any = {
    dispatch: jest.fn(),
  };

  const next = jest.fn();
  const action = sendQuery(new TestQuery(), 'TEST', { foo: 'bar' });
  queryMiddleware(gateway)(api)(next)(action);

  await gateway.emit();
  expect(next).toBeCalledWith(action);
  expect(api.dispatch).toBeCalledWith(queryTransmittedSuccessfully(action.query, action.metadata.entity, action.metadata));

});

it('Should handle failed', async () => {

  const gateway: ClientGatewayInterface | any = {
    emit: jest.fn().mockRejectedValue('Some error'),
  };

  const api: MiddlewareAPI | any = {
    dispatch: jest.fn(),
  };

  const next = jest.fn();

  const action = sendQuery(new TestQuery(), 'TEST', { foo: 'bar' });
  queryMiddleware(gateway)(api)(next)(action);

  await expect(gateway.emit()).rejects.toEqual('Some error');
  expect(next).toBeCalledWith(action);
  expect(api.dispatch).toBeCalledWith(queryTransmissionFailed(action.query, action.metadata.entity, 'Some error', {
    ...action.metadata,
  }));

});
