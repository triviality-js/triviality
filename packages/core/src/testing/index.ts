import { FeatureContext, FF } from '../FeatureFactory';
import { fromPairs, toPairs } from 'ramda';
import { DefaultServices } from '../Feature/defaultServicesKeys';
import { ServicesAsFactories, ServiceTag } from '../ServiceFactory';
import { ContainerFactory } from '../ContainerFactory';

export async function testFeatureFactory<S, D>(ff: FF<S, D>, dependencies: D, contextHook?: (context: FeatureContext<S & DefaultServices & D>) => void): Promise<S & DefaultServices & D> {
  const services = fromPairs(toPairs(dependencies as Record<ServiceTag, any>).map(([tag, service]) => {
    return [tag, () => service];
  })) as any as ServicesAsFactories<D>;
  const dependencyFeature: FF<D, {}> = () => services;
  return ContainerFactory.create()
                         .add(dependencyFeature as any)
                         .add(ff as any)
                         .add((context) => {
                           if (contextHook) {
                             contextHook(context as any);
                           }
                           return {};
                         })
                         .build() as any;
}
