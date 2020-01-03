import { createFeatureFactoryRegistryContext } from '../RegistryContext';
import { always } from 'ramda';
import { SF } from '../../../ServiceFactory';
import { ServiceFunctionReferenceContainer } from '../../../Container';
import { TaggedServiceFactoryReference } from '../../../Value/TaggedServiceFactoryReference';

describe('registerList', () => {
  it('create empty list', () => {
    const context = createFeatureFactoryRegistryContext(new ServiceFunctionReferenceContainer());
    const list = context.registerList<number>();
    expect(list().toArray()).toEqual([]);
  });
  it('create list with thunkify services', () => {
    const context = createFeatureFactoryRegistryContext(new ServiceFunctionReferenceContainer());
    const list = context.registerList<number>(always(1), always(2));
    expect(list().toArray()).toEqual([1, 2]);
  });
  it('create list with service tag references', () => {
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
    const list = context.registerList('tag1', 'tag2');
    container.build();
    expect(list().toArray()).toEqual([1, 2]);
  });
  it('create list with service tag references and thunkify services', () => {
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
    const list = context.registerList('tag1', 'tag2', always(3), 'tag2');
    container.build();
    expect(list().toArray()).toEqual([1, 2, 3, 2]);
  });
});
