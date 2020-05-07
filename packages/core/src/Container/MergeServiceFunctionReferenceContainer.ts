import { ServiceFunctionReferenceContainerInterface } from './ServiceFunctionReferenceContainerInterface';
import { ServiceFactoryReference } from '../Value/ServiceFactoryReference';
import { ServiceTag, SF } from '../ServiceFactory';
import { MergedServiceFunctionReference } from '../Value/MergedServiceFunctionReference';
import { TaggedServiceFactoryReference } from '../Value/TaggedServiceFactoryReference';
import { Override } from '../Value/Override';
import { ImmutableServiceReferenceList } from '../Value/ImmutableServiceReferenceList';
import { asMergeReference } from '../Context';

export class MergeServiceFunctionReferenceContainer<Services = any> implements ServiceFunctionReferenceContainerInterface<Services> {

  public getService = ((tag: ServiceTag) => {
    return asMergeReference(() => this.serviceReferences.getService(tag));
  }) as any;

  private serviceReferences = new ImmutableServiceReferenceList();

  /**
   * The global reference where all service functions are bound to, so
   * the 'this' keyword keeps working.
   */
  private servicesReferences: Record<ServiceTag, SF> = {};

  constructor(private parent: ServiceFunctionReferenceContainerInterface<Services>) {

  }

  /**
   * The services that are from the 'parent' that are passed to the merged feature.
   */
  public addMerged<TService>(reference: ServiceFactoryReference): () => TService {
    this.serviceReferences = this.serviceReferences.add(reference);
    if (reference instanceof TaggedServiceFactoryReference) {
      this.servicesReferences[reference.tag] = reference.getProxy();
    }
    return reference.getProxy();
  }

  /**
   */
  public add<TService>(reference: ServiceFactoryReference): () => TService {
    this.serviceReferences = this.serviceReferences.add(reference);
    const mergedReference = new MergedServiceFunctionReference(reference);
    const proxy = this.parent.add(mergedReference, this.servicesReferences);
    if (reference instanceof TaggedServiceFactoryReference) {
      this.servicesReferences[reference.tag] = proxy;
    }
    return proxy;
  }

  public async build(): Promise<Services> {
    return this.servicesReferences as any;
  }

  public references() {
    return this.serviceReferences;
  }

  /**
   * If the service is
   */
  public override<T>(override: Override<T>): this {
    this.serviceReferences.getService(override.tag).override(override as any);
    return this;
  }

}
