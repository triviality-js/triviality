import { from, timer } from 'rxjs';
import { toArray } from 'rxjs/operators';
import { ServerGatewayMessage } from '../../../Gateway/ValueObject/ServerGatewayMessage';
import { queryHandledFailed, queryHandledSuccessfully } from '../../actions';
import { SerializableQuery } from '../../SerializableQuery';
import { convertQueryHandlerResponseToAction } from '../convertQueryHandlerResponseToAction';

class TestQuery extends SerializableQuery {

}

it('Should emit query', async () => {

  const message1 = {
    gateway: 'gateway 1' as any,
    metadata: {
      entity: 'query 1',
      foo: 'bar',
    },
    payload: new TestQuery(),
  };

  const message2Error = new Error();
  const message2 = {
    gateway: 'gateway 2' as any,
    metadata: {
      entity: 'query 2',
    },
    payload: new TestQuery(),
  };

  const message3 = {
    gateway: 'gateway 3' as any,
    metadata: {
      entity: 'query 3',
    },
    payload: new TestQuery(),
  };
  const actions$ = from([message1, message2, message3])
    .pipe(
      convertQueryHandlerResponseToAction(async (message: ServerGatewayMessage) => {
        switch (message.metadata.entity) {
          case 'query 1':
            return 1;
          case 'query 2':
            throw message2Error;
          case 'query 3':
            return 3;
        }
        throw new Error('Should not happen');
      }),
      toArray(),
    );
  expect(await actions$.toPromise()).toStrictEqual([
    queryHandledSuccessfully(message1.payload, message1.metadata.entity, 1, {}),
    queryHandledFailed(message2.payload, message2.metadata.entity, message2Error, {}),
    queryHandledSuccessfully(message3.payload, message3.metadata.entity, 3, {}),
  ]);
});

it('Ignores execution time', async () => {
  const message1 = {
    gateway: 'gateway 1' as any,
    metadata: {
      entity: 'query 1',
      foo: 'bar',
    },
    payload: new TestQuery(),
  };

  const message2 = {
    gateway: 'gateway 2' as any,
    metadata: {
      entity: 'query 2',
    },
    payload: new TestQuery(),
  };
  const actions$ = from([message1, message2])
    .pipe(
      convertQueryHandlerResponseToAction(async (message: ServerGatewayMessage) => {
        switch (message.metadata.entity) {
          case 'query 1':
            return timer(10).toPromise().then(() => 1);
          case 'query 2':
            return 2;
        }
        throw new Error('Should not happen');
      }),
      toArray(),
    );
  expect(await actions$.toPromise()).toStrictEqual([
    queryHandledSuccessfully(message2.payload, message2.metadata.entity, 2, {}),
    queryHandledSuccessfully(message1.payload, message1.metadata.entity, 1, {}),
  ]);
});
