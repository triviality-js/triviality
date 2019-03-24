import { ClientSocketIOGateway } from '../ClientSocketIOGateway';
import { SerializableAction } from '../../../Redux/SerializableAction';
import { SerializableCommand } from '../../../CommandHandling/SerializableCommand';
import { SerializerInterface } from '../../../Serializer/SerializerInterface';
import { SerializationError } from '../../Error/SerializationError';

class DoSomethingCommand extends SerializableCommand {

}

it('Should be able to listen to actions', async () => {

  const emitter: SocketIOClient.Emitter | any = {
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
  };

  const action: SerializableAction = {
    type: 'hi',
    metadata: {
      playhead: 1,
      entity: 'PRODUCTS',
    },
  };

  const serializer: SerializerInterface | any = {
    deserialize: jest.fn().mockReturnValue(action),
  };

  const gateway = new ClientSocketIOGateway(emitter, serializer);
  const valueSpy = jest.fn();
  const promise = gateway.listen();
  emitter.addEventListener.mock.calls[0][1]();
  (await promise).subscribe(valueSpy);

  expect(emitter.addEventListener.mock.calls[1][0]).toEqual('error');
  expect(emitter.addEventListener.mock.calls[3][0]).toEqual('action');
  emitter.addEventListener.mock.calls[3][1]('serialized action');

  expect(serializer.deserialize).toBeCalledWith('serialized action');

  expect(valueSpy).toBeCalledWith(action);

});

it('Should be able to remove listener', async () => {
  const spy = jest.fn();
  const emitter: SocketIOClient.Emitter | any = {
    addEventListener: jest.fn(() => spy('add')),
    removeEventListener: jest.fn(() => spy('remove')),
  };
  const gateway = new ClientSocketIOGateway(emitter, null as any);
  const promise = gateway.listen();
  emitter.addEventListener.mock.calls[0][1]();
  (await promise).subscribe().unsubscribe();

  expect(emitter.addEventListener.mock.calls[1][0]).toEqual('error');
  expect(emitter.addEventListener.mock.calls[3][0]).toEqual('action');
  expect(emitter.removeEventListener.mock.calls[2][0]).toEqual('error');
  expect(emitter.removeEventListener.mock.calls[3][0]).toEqual('action');
  expect(emitter.removeEventListener.mock.calls[3][1]).toBe(emitter.removeEventListener.mock.calls[3][1]);

  expect(spy.mock.calls).toEqual([['add'], ['add'], ['remove'], ['remove'], ['add'], ['add'], ['remove'], ['remove']]);
});

it('Should be able to emit commands', async () => {
  const emitter: SocketIOClient.Emitter | any = {
    emit: jest.fn(),
  };

  const serializer: SerializerInterface | any = {
    serialize: jest.fn().mockReturnValue('serialized'),
  };
  const gateway = new ClientSocketIOGateway(emitter, serializer);
  const command = new DoSomethingCommand();
  await gateway.emit(command, { entity: 'test' });
  expect(emitter.emit).toBeCalledWith('command', 'serialized');
  expect(serializer.serialize).toBeCalledWith({ command, metadata: { entity: 'test' } });
});

it('Should handle serialize errors', async () => {
  const emitter: SocketIOClient.Emitter | any = {
    emit: jest.fn(),
  };
  const serializer: SerializerInterface | any = {
    serialize: jest.fn(() => {
      throw new Error('Serialize error');
    }),
  };
  const gateway = new ClientSocketIOGateway(emitter, serializer);
  const command = new DoSomethingCommand();
  await expect(gateway.emit(command, { entity: 'test' })).rejects.toEqual(SerializationError.commandCouldNotBeSerialized(command, new Error('Serialize error')));
  expect(serializer.serialize).toBeCalledWith({ command, metadata: { entity: 'test' } });
});

it('Can only emit valid commands', async () => {
  const emitter: SocketIOClient.Emitter | any = {
    emit: jest.fn(),
  };
  const serializer: SerializerInterface | any = {
    serialize: jest.fn(() => {
      throw new Error('Serialize error');
    }),
  };
  const gateway = new ClientSocketIOGateway(emitter, serializer);
  await expect(gateway.emit('something', { entity: 'test' })).rejects.toEqual(SerializationError.couldNotBeSerialized('Something'));
});
