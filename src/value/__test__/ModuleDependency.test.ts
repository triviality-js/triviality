import { FeatureDependency } from '../FeatureDependency';
import { BuildableContainer } from '../BuildableContainer';

class MyFeature {
  public someService() {
    // noop.
  }

  public otherService() {
    // noop.
  }
}

describe('getServices', () => {
  it('Can fetch feature services', () => {
    const dependency = new FeatureDependency(new MyFeature());
    expect(dependency.getServices()).toEqual([
      ['someService', MyFeature.prototype.someService],
      ['otherService', MyFeature.prototype.otherService],
    ]);
  });
});

it('Can fetch empty register from feature without registers', async () => {
  const dependency = new FeatureDependency(new MyFeature());
  expect(await dependency.getRegistries()).toEqual({});
});

describe('defineProperty', () => {
  it('Set defined values on container', () => {
    const myFeature = new MyFeature();
    const dependency = new FeatureDependency(myFeature);
    const container = { someService: null };
    const buildableContainer = new BuildableContainer(container);
    dependency.defineProperty(buildableContainer, 'someService');
    expect(buildableContainer.getReference().someService).toEqual(null);
    myFeature.someService = 1 as any;
    expect(container.someService).toEqual(1);
  });
});
