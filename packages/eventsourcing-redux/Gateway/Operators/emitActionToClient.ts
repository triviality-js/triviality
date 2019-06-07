import { Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { SerializableAction } from '../../Redux/SerializableAction';
import { ServerGatewayInterface } from '../ServerGatewayInterface';

export const emitActionToClient = <T extends ServerGatewayInterface>(gateway: T) => (input: Observable<SerializableAction>): Observable<SerializableAction> =>
  input.pipe(
    mergeMap(async (action) => {
      await gateway.emit(action);
      return action;
    }),
  );
