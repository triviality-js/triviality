import { assetServiceFactory, ServiceFactory, ServiceTag, SF } from '../ServiceFactory';
import { ImmutableServiceReferenceList } from './ImmutableServiceReferenceList';
import { FeatureFactory, FF } from '../FeatureFactory';
import { ServiceFactoryReference } from './ServiceFactoryReference';

export interface ServiceFactoryReferenceOptions {
  readonly factory: SF;
  /**
   * The feature that created this service function.
   */
  readonly feature: FF;
}

export interface ServiceFunctionReferenceConfiguration {
  /**
   * Unique identify this dependency with. This should
   * always be the same, should not be effected by async operations.
   */
  readonly uuid: string;
  /**
   * The callback function proxy this service is referenced by.
   *
   * This allows that the actual service can be overriden.
   *
   * Dependency -> Service factory Proxy -> Actual service factory.
   */
  readonly proxy: ServiceFactory<any>;
}

/**
 * Purpose is to hold information about a service function connection.
 *
 * TODO: Convert mayhem/inheritance, state machine classes.
 *       The ideal world there is only 1 service factory reference for each service, now there are multiple.
 */
export abstract class BaseServiceFactoryReference {
  /**
   * All the dependencies this services is depended on.
   */
  protected dependencies: ImmutableServiceReferenceList;
  /**
   * The actual service function reference.
   */
  protected readonly factory: SF;
  /**
   * If the original service is invoked.
   */
  protected serviceFactoryInvoked: boolean = false;
  /**
   * If the service factory created instance.
   */
  protected serviceDefined: boolean = false;
  /**
   * The instance created by the service factory.
   */
  protected service: unknown | undefined = undefined;
  /**
   * The feature that created this service function.
   */
  protected readonly feature: FeatureFactory<any>;

  protected _configuration: ServiceFunctionReferenceConfiguration | null = null;

  constructor({ factory, feature }: ServiceFactoryReferenceOptions) {
    assetServiceFactory(factory);
    this.factory = factory;
    this.feature = feature;
    this.dependencies = new ImmutableServiceReferenceList();
  }

  public get configuration() {
    if (this._configuration === null) {
      throw new Error('Service reference not yet configured.');
    }
    return this._configuration;
  }

  public getUuid(): string {
    return this.configuration.uuid;
  }

  public callServiceFactory(thisReference: Record<ServiceTag, SF>) {
    this.assertServiceFunctionNotYetInvoked();
    this.serviceFactoryInvoked = true;
    this.service = this.factory.bind(thisReference)();
    this.serviceDefined = true;
  }

  public getService(): unknown {
    this.assertHasServiceInstance();
    return this.service;
  }

  public setContainerConfiguration(configuration: ServiceFunctionReferenceConfiguration) {
    this.assertNotYetConfigured();
    this._configuration = configuration;
  }

  public getFactory(): SF<any> {
    return this.factory;
  }

  public getFeature(): FF {
    return this.feature;
  }

  public getProxy(): SF<any> {
    return this.configuration.proxy;
  }

  public hasServiceInstance() {
    return this.serviceDefined;
  }

  public addDependency(dependency: ServiceFactoryReference) {
    this.dependencies = this.dependencies.add(dependency);
  }

  public getDependencies() {
    return this.dependencies;
  }

  public label() {
    return `#${this.getUuid()} ${this.feature.name || '?'}`;
  }

  private assertServiceFunctionNotYetInvoked() {
    if (this.serviceFactoryInvoked) {
      throw new Error('Service factory is already invoked.');
    }
  }

  private assertNotYetConfigured() {
    if (this._configuration !== null) {
      throw new Error('Service reference already configured.');
    }
  }

  private assertHasServiceInstance() {
    if (!this.hasServiceInstance()) {
      throw new Error('No service instance');
    }
  }
}
