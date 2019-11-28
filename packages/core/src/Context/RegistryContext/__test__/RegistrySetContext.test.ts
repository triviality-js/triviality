import { createFeatureFactoryRegistryContext } from '../RegistryContext';
import { createMutableContainer } from '../../../Container';
import { always } from 'ramda';
import { SF } from '../../../ServiceFactory';

describe('registerSet', () => {
  it('create empty Set', () => {
    const context = createFeatureFactoryRegistryContext(createMutableContainer());
    const Set = context.registerSet<number>();
    expect(Set().toArray()).toEqual([]);
  });
  it('create Set with thunkify services', () => {
    const context = createFeatureFactoryRegistryContext(createMutableContainer());
    const Set = context.registerSet<number>(always(1), always(2));
    expect(Set().toArray()).toEqual([1, 2]);
  });
  it('create Set with service tag references', () => {
    interface Dependencies {
      tag1: SF<number>;
      tag2: SF<number>;
    }

    const container = createMutableContainer()
      .setService('tag1', always(1))
      .setService('tag2', always(2));
    const context = createFeatureFactoryRegistryContext<Dependencies>(container);
    const Set = context.registerSet('tag1', 'tag2');
    expect(Set().toArray()).toEqual([1, 2]);
  });
  it('create Set with service tag references and thunkify services', () => {
    interface Dependencies {
      tag1: SF<number>;
      tag2: SF<number>;
    }

    const container = createMutableContainer()
      .setService('tag1', always(1))
      .setService('tag2', always(2));
    const context = createFeatureFactoryRegistryContext<Dependencies>(container);
    const Set = context.registerSet('tag1', 'tag2', always(3), 'tag2');
    expect(Set().toArray()).toEqual([1, 2, 3]);
  });
});
