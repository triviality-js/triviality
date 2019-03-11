import 'jest';
import { triviality, Feature } from '../index';

class TestFeature implements Feature {

  public testService1() {
    return ['Test service'];
  }

  public testService2(nr: number) {
    return { prop: `service ${nr}` };
  }

  public halloService(...names: string[]) {
    return { hallo: () => `Hallo ${names.join(' ')}` };
  }

}

describe('Caches services', () => {
  it('No arguments', async () => {
    const container = await triviality()
      .add(TestFeature)
      .build();
    expect(container.halloService()).toEqual(container.halloService());
    expect(container.testService1()).toEqual(['Test service']);
  });
  it('Takes a single argument into account', async () => {
    const container = await triviality()
      .add(TestFeature)
      .build();
    expect(container.testService2(1)).toBe(container.testService2(1));
    expect(container.testService2(10)).toBe(container.testService2(10));
    expect(container.testService2(10)).not.toBe(container.testService2(1));
  });
  it('Takes multiple arguments into account', async () => {
    const container = await triviality()
      .add(TestFeature)
      .build();
    expect(container.halloService('john')).toBe(container.halloService('john'));
    expect(container.halloService('john', 'jane')).toBe(container.halloService('john', 'jane'));
    expect(container.halloService('john').hallo()).toEqual('Hallo john');
    expect(container.halloService('john', 'jane').hallo()).toEqual('Hallo john jane');
  });
});

it('Can define properties', async () => {
  const container = await triviality()
    .add(class {
      public property: number = 1;
    })
    .build();
  expect(container.property).toEqual(1);
});
