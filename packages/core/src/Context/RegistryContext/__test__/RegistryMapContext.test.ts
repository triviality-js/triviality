import { createFeatureFactoryRegistryContext } from '../RegistryContext';
import { always } from 'ramda';
import { SF } from '../../../ServiceFactory';
import { TaggedServiceFactoryReference } from '../../../Value/TaggedServiceFactoryReference';
import { ServiceFunctionReferenceContainer } from '../../../Containerd';

describe('registerMap', () => {
  it('create empty map', () => {
    const context = createFeatureFactoryRegistryContext(new ServiceFunctionReferenceContainer());
    const map = context.registerMap<number>();
    expect(map().toArray()).toEqual([]);
  });
  it('create map by object', () => {
    const context = createFeatureFactoryRegistryContext(new ServiceFunctionReferenceContainer());
    const list = context.registerMap<number>({
      foo1: always(1),
      bar2: always(2),
    });
    expect(list().toArray()).toEqual([['foo1', 1], ['bar2', 2]]);
  });
  it('create map by pairs ', () => {
    const context = createFeatureFactoryRegistryContext(new ServiceFunctionReferenceContainer());
    const list = context.registerMap<number>(['foo1', always(1)], ['bar2', always(2)]);
    expect(list().toArray()).toEqual([['foo1', 1], ['bar2', 2]]);
  });
  it('create map by tagged object', async () => {
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
    const map = context.registerMap({ foo1: 'tag1', bar2: 'tag2' });
    await container.build();
    expect(map().toArray()).toEqual([['foo1', 1], ['bar2', 2]]);
  });
  it('create map by tagged pairs', async () => {
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
    const map = context.registerMap(['foo1', 'tag1'], ['bar2', 'tag2']);
    await container.build();
    expect(map().toArray()).toEqual([['foo1', 1], ['bar2', 2]]);
  });

  it('Keys as reference value', async () => {
    interface Dependencies {
      tag1: SF<number>;
      tag2: SF<number>;
    }

    const ref1 = {};
    const ref2 = {};

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
    const map = context.registerMap([ref1, 'tag1'], [ref2, 'tag2']);
    await container.build();
    expect(map().toArray()).toEqual([[ref1, 1], [ref2, 2]]);
  });
});
