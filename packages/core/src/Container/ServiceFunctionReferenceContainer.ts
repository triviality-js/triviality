import { ServiceTag, SF } from '../ServiceFactory';
import { ServiceFactoryReference } from '../Value/ServiceFactoryReference';
import { Override } from '../Value/Override';
import { TaggedServiceFactoryReference } from '../Value/TaggedServiceFactoryReference';
import {
  ServiceFunctionReferenceContainerInterface,
} from './ServiceFunctionReferenceContainerInterface';
import { ImmutableServiceReferenceList } from '../Value/ImmutableServiceReferenceList';

export enum BuildingState {
  defineServices,
  buildServices,
  done,
}

/**
 * Responsible for knowing about the wiring of the different services.
 *
 * The application only knows about references to a service, as function callback, ServiceReference,
 * for the end user this is named SF.
 *
 * - Protects the application of using the references for the application is fully done with
 * wiring everything.
 * - Stores the usage tree of the SF, as a dependency tree.
 */
export class ServiceFunctionReferenceContainer<Services = any> implements ServiceFunctionReferenceContainerInterface<Services> {

  public getService = ((tag: ServiceTag) => () => this.serviceReferences.getService(tag).getProxy()()) as any;

  private state: BuildingState = BuildingState.defineServices;

  private serviceReferences = new ImmutableServiceReferenceList();
  private dependencyCallStack = new ImmutableServiceReferenceList();

  /**
   * The global reference where all service functions are bound to, so
   * the 'this' keyword keeps working.
   */
  private servicesReferences: Record<ServiceTag, SF> = {};

  public references() {
    return this.serviceReferences;
  }

  public getCallStack() {
    return this.dependencyCallStack;
  }

  /**
   * Return the actual referenced used by the application to fetch the service instance.
   * The first run it preserves a dependencyCallStack, to know the dependency tree.
   */
  public add<TService>(reference: ServiceFactoryReference, bound = this.servicesReferences): SF<TService> {
    this.assertDefineServices();
    this.serviceReferences = this.serviceReferences.add(reference);
    reference.setContainerConfiguration({
      uuid: this.createUuid(),
      proxy: () => {
        if (this.state === BuildingState.done) {
          return reference.getService();
        }

        this.assertBuildServices();
        const current = this.currentBuild();
        if (current) {
          current.addDependency(reference);
        }
        if (reference.hasServiceInstance()) {
          return reference.getService();
        }
        this.dependencyCallStack = this.dependencyCallStack.add(reference);
        /**
         * This will cause a chain of dependencies to be called.
         */
        reference.callServiceFactory(bound);

        this.dependencyCallStack = this.dependencyCallStack.remove(reference);

        return reference.getService();
      },
    });
    if (reference instanceof TaggedServiceFactoryReference) {
      this.servicesReferences[reference.tag] = reference.getProxy();
    }
    return reference.configuration.proxy;
  }

  public build(): Services {
    this.assertDefineServices();
    this.state = BuildingState.buildServices;

    const container: Record<ServiceTag, unknown> = {};

    this.serviceReferences.toArray().forEach((dependency) => {
      const instance = dependency.getProxy()();
      if (dependency instanceof TaggedServiceFactoryReference) {
        container[dependency.tag] = instance;
      }
    });

    this.state = BuildingState.done;
    return container as any;
  }

  public override<T>(override: Override<T>) {
    this.serviceReferences.getService(override.tag).override(override as any);
    return this;
  }

  private createUuid(): string {
    return `${this.references().count()}`;
  }

  private currentBuild = () => this.dependencyCallStack.last();

  private assertBuildServices = () => {
    if (this.state !== BuildingState.buildServices) {
      throw new Error('Should be in build services');
    }
  };

  private assertDefineServices = () => {
    if (this.state !== BuildingState.defineServices) {
      throw new Error('Should be in define services');
    }
  };
}
