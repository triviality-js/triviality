import { ServiceFunctionReferenceConfiguration } from './BaseServiceFactoryReference';
import { ServiceTag, SF } from '../ServiceFactory';
import { FF } from '../FeatureFactory';
import type { ServiceFactoryReference } from './ServiceFactoryReference';
import { ImmutableServiceReferenceList } from './ImmutableServiceReferenceList';

export class MergedServiceFunctionReference {
  public readonly type = 'merged';

  constructor(private original: ServiceFactoryReference) {
  }

  public get configuration(): ServiceFunctionReferenceConfiguration {
    return this.original.configuration;
  }

  public getUuid(): string {
    return this.original.getUuid();
  }

  public callServiceFactory(thisReference: Record<ServiceTag, SF>) {
    this.original.callServiceFactory(thisReference);
  }

  public getService(): unknown {
    return this.original.getService();
  }

  public setContainerConfiguration(configuration: ServiceFunctionReferenceConfiguration) {
    this.original.setContainerConfiguration(configuration);
  }

  public getFactory(): SF<any> {
    return this.original.getFactory();
  }

  public getFeature(): FF {
    return this.original.getFeature();
  }

  public getProxy(): SF<any> {
    return this.original.getProxy();
  }

  public hasServiceInstance(): boolean {
    return this.original.hasServiceInstance();
  }

  public addDependency(dependency: ServiceFactoryReference) {
    this.original.addDependency(dependency);
  }

  public getDependencies(): ImmutableServiceReferenceList {
    return this.original.getDependencies();
  }

  public label(): string {
    return `{${this.original.label()}}`;
  }
}
