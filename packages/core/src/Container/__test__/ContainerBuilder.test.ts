import { ServiceFunctionReferenceContainer } from '../ServiceFunctionReferenceContainer';
import { TaggedServiceFactoryReference } from '../../Value/TaggedServiceFactoryReference';

describe('ContainerBuilder', () => {
  it('Can add dependency', async () => {
    const container = new ServiceFunctionReferenceContainer();
    container.add(new TaggedServiceFactoryReference({
      tag: 'foobar',
      factory: () => 1,
      feature: () => Object,
    }));
    expect(await container.build()).toEqual({
      foobar: 1,
    });
  });

  it('Can add multiple dependencies', async () => {
    const builder = new ServiceFunctionReferenceContainer();
    builder.add(new TaggedServiceFactoryReference({
      tag: 'foo',
      factory: () => 'hi',
      feature: () => Object,
    }));
    builder.add(new TaggedServiceFactoryReference({
      tag: 'bar',
      factory: () => 'bye',
      feature: () => Object,
    }));
    expect(await builder.build()).toEqual({
      foo: 'hi',
      bar: 'bye',
    });
  });

  it('Should be able to get reference to an actual service', async () => {
    const builder = new ServiceFunctionReferenceContainer();
    builder.add(new TaggedServiceFactoryReference({
      tag: 'foobar',
      factory: () => 1,
      feature: () => Object,
    }));
    expect(await  builder.build()).toEqual({
      foobar: 1,
    });
  });

  it('Should be able to call service by reference', async () => {
    const builder = new ServiceFunctionReferenceContainer();
    builder.add(new TaggedServiceFactoryReference({
      tag: 'foobar',
      factory: () => 1,
      feature: () => Object,
    }));
    await builder.build();
    expect(builder.getService('foobar')()).toEqual(1);
  });

  describe('Know dependencies chain',  () => {
    it('Of single dependency', async () => {
      const builder = new ServiceFunctionReferenceContainer();
      builder.add(new TaggedServiceFactoryReference({
        tag: 'house',
        factory: () => 'Nice house',
        feature: () => Object,
      }));
      builder.add(new TaggedServiceFactoryReference({
        tag: 'person',
        factory: () => `Eric lives in a ${builder.getService('house')()}`,
        feature: () => Object,
      }));

      expect(await builder.build()).toEqual({
        person: 'Eric lives in a Nice house',
        house: 'Nice house',
      });
    });
  });
});
