import { ServiceTag, SF } from '../ServiceFactory';
import { ServiceFactoryReference } from '../Value/ServiceFactoryReference';
import { Override } from '../Value/Override';
import { ImmutableServiceReferenceList } from '../Value/ImmutableServiceReferenceList';

export interface ServiceFunctionReferenceContainerInterface<Services = any> {
  getService: <T extends keyof Services>(tag: T) => SF<Services[T]>;

  references(): ImmutableServiceReferenceList;

  add(reference: ServiceFactoryReference, bound?: Record<ServiceTag, SF>): SF<any>;

  override<T>(override: Override<T>): this;

  build(): Services;
}
