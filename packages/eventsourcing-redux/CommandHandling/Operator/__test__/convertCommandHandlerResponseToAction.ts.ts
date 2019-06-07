import { from, timer } from 'rxjs';
import { toArray } from 'rxjs/operators';
import { ServerGatewayMessage } from '../../../Gateway/ValueObject/ServerGatewayMessage';
import { commandHandledFailed, commandHandledSuccessfully } from '../../actions';
import { SerializableCommand } from '../../SerializableCommand';
import { convertCommandHandlerResponseToAction } from '../convertCommandHandlerResponseToAction';

class TestCommand extends SerializableCommand {

}

it('Should emit commands', async () => {

  const message1 = {
    gateway: 'gateway 1' as any,
    metadata: {
      entity: 'command 1',
      foo: 'bar',
    },
    payload: new TestCommand(),
  };

  const message2Error = new Error();
  const message2 = {
    gateway: 'gateway 2' as any,
    metadata: {
      entity: 'command 2',
    },
    payload: new TestCommand(),
  };

  const message3 = {
    gateway: 'gateway 3' as any,
    metadata: {
      entity: 'command 3',
    },
    payload: new TestCommand(),
  };
  const actions$ = from([message1, message2, message3])
    .pipe(
      convertCommandHandlerResponseToAction(async (message: ServerGatewayMessage) => {
        switch (message.metadata.entity) {
          case 'command 1':
            return 1;
          case 'command 2':
            throw message2Error;
          case 'command 3':
            return 3;
        }
        throw new Error('Should not happen');
      }),
      toArray(),
    );
  expect(await actions$.toPromise()).toStrictEqual([
    commandHandledSuccessfully(message1.payload, message1.metadata.entity, 1, {}),
    commandHandledFailed(message2.payload, message2.metadata.entity, message2Error, {}),
    commandHandledSuccessfully(message3.payload, message3.metadata.entity, 3, {}),
  ]);
});

it('Ignores execution time', async () => {
  const message1 = {
    gateway: 'gateway 1' as any,
    metadata: {
      entity: 'command 1',
      foo: 'bar',
    },
    payload: new TestCommand(),
  };

  const message2 = {
    gateway: 'gateway 2' as any,
    metadata: {
      entity: 'command 2',
    },
    payload: new TestCommand(),
  };
  const actions$ = from([message1, message2])
    .pipe(
      convertCommandHandlerResponseToAction(async (message: ServerGatewayMessage) => {
        switch (message.metadata.entity) {
          case 'command 1':
            return timer(10).toPromise().then(() => 1);
          case 'command 2':
            return 2;
        }
        throw new Error('Should not happen');
      }),
      toArray(),
    );
  expect(await actions$.toPromise()).toStrictEqual([
    commandHandledSuccessfully(message2.payload, message2.metadata.entity, 2, {}),
    commandHandledSuccessfully(message1.payload, message1.metadata.entity, 1, {}),
  ]);
});
