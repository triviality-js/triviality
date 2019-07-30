import { createFeatureFactoryRegistryContext } from '../FeatureFactoryRegistryContext';
import { createMutableContainer } from '../../../Container';
import { always } from 'ramda';
import { SF } from '../../../ServiceFactory';

describe('registerMap', () => {
  it('create empty map', () => {
    const context = createFeatureFactoryRegistryContext(createMutableContainer());
    const map = context.registerMap<number>();
    expect(map().toArray()).toEqual([]);
  });
  it('create map by object', () => {
    const context = createFeatureFactoryRegistryContext(createMutableContainer());
    const list = context.registerMap<number>({
      foo1: always(1),
      bar2: always(2),
    });
    expect(list().toArray()).toEqual([['foo1', 1], ['bar2', 2]]);
  });
  it('create map by pairs ', () => {
    const context = createFeatureFactoryRegistryContext(createMutableContainer());
    const list = context.registerMap<number>(['foo1', always(1)], ['bar2', always(2)]);
    expect(list().toArray()).toEqual([['foo1', 1], ['bar2', 2]]);
  });
  it('create map by tagged object', () => {
    interface Dependencies {
      tag1: SF<number>;
      tag2: SF<number>;
    }

    const container = createMutableContainer()
      .setService('tag1', always(1))
      .setService('tag2', always(2));
    const context = createFeatureFactoryRegistryContext<Dependencies>(container);
    const map = context.registerMap({ foo1: 'tag1', bar2: 'tag2' });
    expect(map().toArray()).toEqual([['foo1', 1], ['bar2', 2]]);
  });
  it('create map by tagged pairs', () => {
    interface Dependencies {
      tag1: SF<number>;
      tag2: SF<number>;
    }

    const container = createMutableContainer()
      .setService('tag1', always(1))
      .setService('tag2', always(2));
    const context = createFeatureFactoryRegistryContext<Dependencies>(container);
    const map = context.registerMap(['foo1', 'tag1'], ['bar2', 'tag2']);
    expect(map().toArray()).toEqual([['foo1', 1], ['bar2', 2]]);
  });
});
