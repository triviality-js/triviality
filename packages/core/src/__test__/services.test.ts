import 'jest';
import { triviality } from '../index';

const TestFeature = () => ({
  testService1() {
    return ['Test service'];
  },

  halloService() {
    return { hallo: (...names: string[]) => `Hallo ${names.join(' ')}` };
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
