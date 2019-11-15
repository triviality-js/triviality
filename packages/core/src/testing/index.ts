import { FF } from '../FeatureFactory';
import { ServiceFactory, ServiceTag } from '../ServiceFactory';
import triviality from '../index';

export async function testFeatureFactory<S, D>(sf: FF<S, D>, dependencies: Record<ServiceTag, ServiceFactory>) {
  return triviality().add(() => dependencies).add(sf as any).build();
}
