import { ProjectorGatewayFactory } from '@triviality/eventsourcing-redux/Gateway/Projector/ProjectorGatewayFactory';
import { SocketIoGatewayOptions } from '@triviality/eventsourcing-redux/Gateway/socket.io/SocketIoGatewayFactory';
import { ProjectorGatewayInterface } from '@triviality/eventsourcing-redux/ReadModel/ProjectorGatewayInterface';
import { ReadModelMetadata } from '@triviality/eventsourcing-redux/ReadModel/ReadModelAction';
import { UserId } from '../../../shared/ValueObject/UserId';

export class AccountGatewayFactory implements ProjectorGatewayFactory<UserId, UserId> {

  constructor(private gateway: ProjectorGatewayFactory<SocketIoGatewayOptions, UserId>) {

  }

  public close(id: UserId): void {
    this.gateway.close(this.socketOptionsForUser(id));
  }

  public get(id: UserId): ProjectorGatewayInterface<UserId, ReadModelMetadata<UserId>> {
    return this.gateway.get(this.socketOptionsForUser(id));
  }

  public open(id: UserId): ProjectorGatewayInterface<UserId, ReadModelMetadata<UserId>> {
    return this.gateway.open(this.socketOptionsForUser(id));
  }

  private socketOptionsForUser(id: UserId) {
    return { nsp: `/account/${id.toString()}` };
  }

}
