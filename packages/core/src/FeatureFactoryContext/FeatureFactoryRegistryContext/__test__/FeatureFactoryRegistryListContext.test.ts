import { createFeatureFactoryRegistryContext } from '../FeatureFactoryRegistryContext';
import { createMutableContainer } from '../../../container';
import { always } from 'ramda';
import { SF } from '../../../ServiceFactory';

describe('registerList', () => {
  it('create empty list', () => {
    const context = createFeatureFactoryRegistryContext(createMutableContainer());
    const list = context.registerList<number>();
    expect(list().toArray()).toEqual([]);
  });
  it('create list with thunkify services', () => {
    const context = createFeatureFactoryRegistryContext(createMutableContainer());
    const list = context.registerList<number>(always(1), always(2));
    expect(list().toArray()).toEqual([1, 2]);
  });
  it('create list with service tag references', () => {
    interface Dependencies {
      tag1: SF<number>;
      tag2: SF<number>;
    }

    const container = createMutableContainer()
      .setService('tag1', always(1))
      .setService('tag2', always(2));
    const context = createFeatureFactoryRegistryContext<Dependencies>(container);
    const list = context.registerList('tag1', 'tag2');
    expect(list().toArray()).toEqual([1, 2]);
  });
  it('create list with service tag references and thunkify services', () => {
    interface Dependencies {
      tag1: SF<number>;
      tag2: SF<number>;
    }

    const container = createMutableContainer()
      .setService('tag1', always(1))
      .setService('tag2', always(2));
    const context = createFeatureFactoryRegistryContext<Dependencies>(container);
    const list = context.registerList('tag1', 'tag2', always(3), 'tag2');
    expect(list().toArray()).toEqual([1, 2, 3, 2]);
  });
});
