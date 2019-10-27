import { fromPairs, reduce, toPairs } from 'ramda';
import { createImmutableContainer } from '../container';
import { FF } from '../FeatureFactory';
import { invokeFeatureFactory } from '../invokeFeatureFactory';

export function testFeatureFactory<S, D>(sf: FF<S, D>, dependencies: D): S {
  const  container =
  let container = reduce((acc, [tag, dep]) => acc.setService(tag, dep as any), createImmutableContainer(), toPairs(dependencies as any));
  container = invokeFeatureFactory(container, sf);
  return fromPairs(container.services()) as any as S;
}
