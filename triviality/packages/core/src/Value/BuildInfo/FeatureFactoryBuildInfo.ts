import { UFF } from "../FeatureFactory";
import type {FeatureGroupBuildInfo} from "./FeatureGroupBuildInfo";
import type {ServiceFactoryInfo } from './ServiceFactoryInfo';

export class FeatureFactoryBuildInfo {
  protected services = new Set<ServiceFactoryInfo>();
  protected containers = new Set<FeatureGroupBuildInfo>();

  constructor(public readonly featureFactoryFunction: UFF) {
  }

  public addService(service: ServiceFactoryInfo) {
    this.services.add(service);
  }

  public getServices() {
    return Array.from(this.services);
  }

  public addContainer(service: FeatureGroupBuildInfo) {
    this.containers.add(service);
  }

  public getContainers() {
    return Array.from(this.containers);
  }
}
