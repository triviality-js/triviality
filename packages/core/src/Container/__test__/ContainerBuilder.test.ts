import { ServiceFunctionReferenceContainer } from '../ServiceFunctionReferenceContainer';
import { TaggedServiceFactoryReference } from '../../Value/TaggedServiceFactoryReference';

describe('ContainerBuilder', () => {
  it('Can add dependency', () => {
    const container = new ServiceFunctionReferenceContainer();
    container.add(new TaggedServiceFactoryReference({
      tag: 'foobar',
      factory: () => 1,
      feature: () => Object,
    }));
    expect(container.build()).toEqual({
      foobar: 1,
    });
  });

  it('Can add multiple dependencies', () => {
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
    expect(builder.build()).toEqual({
      foo: 'hi',
      bar: 'bye',
    });
  });

  it('Should be able to get reference to an actual service', () => {
    const builder = new ServiceFunctionReferenceContainer();
    builder.add(new TaggedServiceFactoryReference({
      tag: 'foobar',
      factory: () => 1,
      feature: () => Object,
    }));
    expect(builder.build()).toEqual({
      foobar: 1,
    });
  });

  it('Should be able to call service by reference', () => {
    const builder = new ServiceFunctionReferenceContainer();
    builder.add(new TaggedServiceFactoryReference({
      tag: 'foobar',
      factory: () => 1,
      feature: () => Object,
    }));
    builder.build();
    expect(builder.getService('foobar')()).toEqual(1);
  });

  describe('Know dependencies chain', () => {
    it('Of single dependency', () => {
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

      expect(builder.build()).toEqual({
        person: 'Eric lives in a Nice house',
        house: 'Nice house',
      });
    });
  });
});
