import { ServerGatewayInterface } from '../Gateway/ServerGatewayInterface';
import { Observable, Subject } from 'rxjs';
import { ServerGatewayMessage } from '../Gateway/ValueObject/ServerGatewayMessage';
import { SerializableAction } from '../Redux/SerializableAction';

export class GatewayMock implements ServerGatewayInterface {
  public open: boolean = true;

  public emit = jest.fn().mockResolvedValue(null);

  public messages$ = new Subject<ServerGatewayMessage<any>>();

  public error$ = new Subject<any>();

  public listen(): Observable<ServerGatewayMessage<any>> {
    return this.messages$;
  }

  public warnings(): Observable<any> {
    return this.error$;
  }

  public getTransmittedActions(): SerializableAction[] {
    return this.emit.mock.calls.map((args) => args[0]);
  }
}
