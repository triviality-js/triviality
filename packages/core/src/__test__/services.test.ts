import 'jest';
import { ContainerError, triviality } from '../index';

const TestFeature = () => ({
  testService1() {
    return ['Test service'];
  },

  testService2(nr: number) {
    return { prop: `service ${nr}` };
  },

  halloService(...names: string[]) {
    return { hallo: () => `Hallo ${names.join(' ')}` };
  },
});

describe('Caches services', () => {
  it('No arguments', async () => {
    const container = await triviality()
      .add(TestFeature)
      .build();
    expect(container.halloService()).toEqual(container.halloService());
    expect(container.testService1()).toEqual(['Test service']);
  });
});

it('Cannot define properties', async () => {
  await expect(triviality()
    .add(() => ({
      property: 1,
    }))
    .build()).rejects.toEqual(ContainerError.isNotAServiceFunction('property'));
});
