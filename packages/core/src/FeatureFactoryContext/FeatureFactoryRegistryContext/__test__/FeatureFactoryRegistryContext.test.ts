import { createMutableContainer } from '../../../container';
import { createFeatureFactoryRegistryContext } from '../../FeatureFactoryRegistryContext';

describe('createFeatureFactoryRegistryContext', () => {
  it('Can register map', () => {
    const context = createFeatureFactoryRegistryContext(createMutableContainer());
    const map = context.registerMap<number>(['a', () => 1]);
    expect(map().toArray()).toEqual([['a', 1]]);
  });
  it('Can register list', () => {
    const context = createFeatureFactoryRegistryContext(createMutableContainer());
    const list = context.registerList<number>(() => 1, () => 2);
    expect(Array.from(list())).toEqual([1, 2]);
  });
});
