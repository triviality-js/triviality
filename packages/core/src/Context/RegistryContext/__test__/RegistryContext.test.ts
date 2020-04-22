import {
  createFeatureFactoryRegistryContext,
  makeImmutableRegistryList,
  makeImmutableRegistryMap,
  RegistryList,
  RegistryMap,
} from '../..';
import { ServiceFunctionReferenceContainer } from '../../../Containerd';
import { TaggedServiceFactoryReference } from '../../../Value/TaggedServiceFactoryReference';

describe('createFeatureFactoryRegistryContext', () => {
  it('Can register map', () => {
    const context = createFeatureFactoryRegistryContext(new ServiceFunctionReferenceContainer());
    const map = context.registerMap<number>(['a', () => 1]);
    expect(map().toArray()).toEqual([['a', 1]]);
  });
  it('Can register list', () => {
    const context = createFeatureFactoryRegistryContext(new ServiceFunctionReferenceContainer());
    const list = context.registerList<number>(() => 1, () => 2);
    expect(Array.from(list())).toEqual([1, 2]);
  });
  it('Can register to map', async () => {
    const container = new ServiceFunctionReferenceContainer();
    container.add(new TaggedServiceFactoryReference({
      tag: 'MyRegister',
      factory: () => makeImmutableRegistryMap<number>(['bar', 2]),
      feature: () => Object,
    }));
    const context = createFeatureFactoryRegistryContext<{ MyRegister: RegistryMap<number> }>(container);
    context.registers.MyRegister(['foo', () => 1]);
    await container.build();
    const registry: RegistryMap<number> = container.getService('MyRegister')() as any;
    expect(registry.toArray()).toEqual([['bar', 2], ['foo', 1]]);
  });
  it('Can register to list', async () => {
    const container = new ServiceFunctionReferenceContainer();
    container.add(new TaggedServiceFactoryReference({
      tag: 'MyRegister',
      factory: () => makeImmutableRegistryList(2),
      feature: () => Object,
    }));
    const context = createFeatureFactoryRegistryContext<{ MyRegister: RegistryList<number> }>(container);
    context.registers.MyRegister(() => 1);
    await container.build();
    const registry: RegistryList<number> = container.getService('MyRegister')() as any;
    expect(registry.toArray()).toEqual([2, 1]);
  });
});
