import { createMutableContainer } from '../../../Container';
import {
  createFeatureFactoryRegistryContext,
  makeImmutableRegistryList,
  makeImmutableRegistryMap,
  RegistryList,
  RegistryMap,
} from '../..';

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
  it('Can register to nothing', () => {
    const container = createMutableContainer();
    container.setService('MyRegister', jest.fn());
    const context = createFeatureFactoryRegistryContext<{ MyRegister: RegistryMap<number> }>(container);
    context.registers.MyRegister();
  });
  it('Can register to map', () => {
    const container = createMutableContainer();
    container.setService('MyRegister', makeImmutableRegistryMap(['bar', 2]));
    const context = createFeatureFactoryRegistryContext<{ MyRegister: RegistryMap<number> }>(container);
    context.registers.MyRegister(['foo', () => 1]);
    const registry: RegistryMap<number> = container.getService('MyRegister')() as any;
    expect(registry.toArray()).toEqual([['bar', 2], ['foo', 1]]);
  });
  it('Can register to list', () => {
    const container = createMutableContainer();
    container.setService('MyRegister', makeImmutableRegistryList(2));
    const context = createFeatureFactoryRegistryContext<{ MyRegister: RegistryList<number> }>(container);
    context.registers.MyRegister(() => 1);
    const registry: RegistryList<number> = container.getService('MyRegister')() as any;
    expect(registry.toArray()).toEqual([2, 1]);
  });
});
