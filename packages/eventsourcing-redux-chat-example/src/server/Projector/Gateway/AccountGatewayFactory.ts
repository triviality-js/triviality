import { ReadModelMetadata } from "eventsourcing-redux-bridge/ReadModel/ReadModelAction";
import { ProjectorGatewayInterface } from "eventsourcing-redux-bridge/ReadModel/ProjectorGatewayInterface";
import { ProjectorGatewayFactory } from "eventsourcing-redux-bridge/Gateway/Projector/ProjectorGatewayFactory";
import { UserId } from "../../../shared/ValueObject/UserId";
import {SocketIoGatewayOptions} from "eventsourcing-redux-bridge/Gateway/socket.io/SocketIoGatewayFactory";

export class AccountGatewayFactory implements ProjectorGatewayFactory<UserId, UserId> {

  constructor(private gateway: ProjectorGatewayFactory<SocketIoGatewayOptions, UserId>) {

  }

  public close(id: UserId): void {
    this.gateway.close(this.socketOptionsForUser(id));
  }

  public get(id: UserId): ProjectorGatewayInterface<UserId , ReadModelMetadata<UserId>> {
    return this.gateway.get(this.socketOptionsForUser(id));
  }

  public open(id: UserId): ProjectorGatewayInterface<UserId, ReadModelMetadata<UserId>> {
    return this.gateway.open(this.socketOptionsForUser(id));
  }

  private socketOptionsForUser(id: UserId) {
    return { nsp: '/account/' + id.toString() };
  }

}
