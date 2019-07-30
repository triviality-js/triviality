import { fromPairs, toPairs } from 'ramda';
import { createMutableLockableContainer } from './Container';
import { FF } from './FeatureFactory';
import { invokeFeatureFactory } from './invokeFeatureFactory';
import { ServiceFactory, ServiceTag } from './ServiceFactory';

export function testFeatureFactory<S, D extends Record<ServiceTag, ServiceFactory>>(sf: FF<S, D>, dependencies: D): S {
  const container = createMutableLockableContainer();
  for (const [key, dep] of toPairs(dependencies)) {
    container.setService(key, dep);
  }
  invokeFeatureFactory(container, sf);
  container.lock();
  return fromPairs(container.services()) as any as S;
}
