import { ModuleDependency } from '../ModuleDependency';
import { BuildableContainer } from '../BuildableContainer';

class MyModule {
  public someService() {
    // noop.
  }

  public otherService() {
    // noop.
  }
}

describe('getServices', () => {
  it('Can fetch modules services', () => {
    const dependency = new ModuleDependency(new MyModule());
    expect(dependency.getServices()).toEqual([
      ['someService', MyModule.prototype.someService],
      ['otherService', MyModule.prototype.otherService],
    ]);
  });
});

it('Can fetch empty register from module without registers', () => {
  const dependency = new ModuleDependency(new MyModule());
  expect(dependency.getRegistries()).toEqual({});
});

describe('defineProperty', () => {
  it('Set defined values on container', () => {
    const myModule = new MyModule();
    const dependency = new ModuleDependency(myModule);
    const container = { someService: null };
    const buildableContainer = new BuildableContainer(container);
    dependency.defineProperty(buildableContainer, 'someService');
    expect(buildableContainer.getReference().someService).toEqual(null);
    myModule.someService = 1 as any;
    expect(container.someService).toEqual(1);
  });
});
