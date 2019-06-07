import { Identity } from '@triviality/eventsourcing/ValueObject/Identity';
import { ProjectorGatewayFactory } from '../Gateway/Projector/ProjectorGatewayFactory';
import { hash, Map } from 'immutable';
import { GatewayMock } from './GatewayMock';
import { StoreRepositoryInterface } from '../ReadModel/StoreRepositoryInterface';
import { ProjectorGatewayInterface } from '../ReadModel/ProjectorGatewayInterface';
import { ReadModelAction, ReadModelMetadata } from '../ReadModel/ReadModelAction';
import { DistinctProjectorGateway } from '../ReadModel/Projector/DistinctProjectorGateway';

export class GateWayFactoryMock<State, Id extends Identity, Options> implements ProjectorGatewayFactory<Options, Id> {
  public gateways = Map<number, GatewayMock>();

  constructor(protected readonly repository: StoreRepositoryInterface<State, Id, any, any>) {
  }

  public close(options: Options): void {
    const key = this.getHash(options);
    const serverGateway = this.gateways.get(key);
    if (!serverGateway || !serverGateway.open) {
      throw new Error('Gateway is not open');
    }
    serverGateway.open = false;
  }

  public get(options: Options): ProjectorGatewayInterface<Id, ReadModelMetadata<Id>, ReadModelAction<Id>> {
    const key = this.getHash(options);
    const serverGateway = this.gateways.get(key);
    if (!serverGateway || !serverGateway.open) {
      throw new Error('Gateway is not open');
    }
    return new DistinctProjectorGateway<State, Id>(this.repository as any, serverGateway);
  }

  public open(options: Options): ProjectorGatewayInterface<Id, ReadModelMetadata<Id>, ReadModelAction<Id>> {
    const key = this.getHash(options);
    const serverGateway = this.gateways.get(key);
    if (serverGateway && serverGateway.open) {
      throw new Error('Gateway already open');
    }
    const gatewayMock = this.gateways.get(key, new GatewayMock());
    gatewayMock.open = true;
    this.gateways = this.gateways.set(key, gatewayMock);
    return new DistinctProjectorGateway<State, Id>(this.repository as any, gatewayMock);
  }

  public getMock(options: Options): GatewayMock {
    const key = this.getHash(options);
    const serverGateway = this.gateways.get(key);
    if (!serverGateway || !serverGateway.open) {
      throw new Error('Gateway is not open');
    }
    return serverGateway;
  }

  private getHash(options: Options) {
    return hash(JSON.stringify(options));
  }
}
