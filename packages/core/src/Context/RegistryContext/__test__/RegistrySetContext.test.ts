import { createFeatureFactoryRegistryContext } from '../RegistryContext';
import { always } from 'ramda';
import { SF } from '../../../ServiceFactory';
import { TaggedServiceFactoryReference } from '../../../Value/TaggedServiceFactoryReference';
import { ServiceFunctionReferenceContainer } from '../../../Containerd';

describe('registerSet', () => {
  it('create empty Set', () => {
    const context = createFeatureFactoryRegistryContext(new ServiceFunctionReferenceContainer());
    const Set = context.registerSet<number>();
    expect(Set().toArray()).toEqual([]);
  });
  it('create Set with thunkify services', () => {
    const context = createFeatureFactoryRegistryContext(new ServiceFunctionReferenceContainer());
    const Set = context.registerSet<number>(always(1), always(2));
    expect(Set().toArray()).toEqual([1, 2]);
  });
  it('create Set with service tag references', () => {
    interface Dependencies {
      tag1: SF<number>;
      tag2: SF<number>;
    }

    const container = new ServiceFunctionReferenceContainer();
    container.add(new TaggedServiceFactoryReference({
      tag: 'tag1',
      factory: always(1),
      feature: () => Object,
    }));
    container.add(new TaggedServiceFactoryReference({
      tag: 'tag2',
      factory: always(2),
      feature: () => Object,
    }));
    const context = createFeatureFactoryRegistryContext<Dependencies>(container);
    const Set = context.registerSet('tag1', 'tag2');
    container.build();
    expect(Set().toArray()).toEqual([1, 2]);
  });
  it('create Set with service tag references and thunkify services', async () => {
    interface Dependencies {
      tag1: SF<number>;
      tag2: SF<number>;
    }

    const container = new ServiceFunctionReferenceContainer();
    container.add(new TaggedServiceFactoryReference({
      tag: 'tag1',
      factory: always(1),
      feature: () => Object,
    }));
    container.add(new TaggedServiceFactoryReference({
      tag: 'tag2',
      factory: always(2),
      feature: () => Object,
    }));
    const context = createFeatureFactoryRegistryContext<Dependencies>(container);
    const Set = context.registerSet('tag1', 'tag2', always(3), 'tag2');
    await container.build();
    expect(Set().toArray()).toEqual([1, 2, 3]);
  });
});
