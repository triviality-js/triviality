import { FF } from '../FeatureFactory';
import { ServiceFactory, ServiceTag } from '../ServiceFactory';
import triviality, { SetupFeatureServices } from '../index';

export async function testFeatureFactory<S, D>(ff: FF<S, D>, dependencies: Record<ServiceTag, ServiceFactory>): Promise<S & SetupFeatureServices> {
  return triviality().add(() => dependencies).add(ff as any).build() as any;
}
