import 'jest';
import { Container, triviality, Module } from '../index';
import { ContainerError } from '../ContainerError';

class TestModule implements Module {

  public testService() {
    return ['Test service'];
  }

  public halloService(...names: string[]) {
    return { hallo: () => `Hallo ${names.join(' ')}` };
  }

  public changeMyself() {
    this.testService = () => ['Changed!?'];
  }

}

it('Container is locked and cannot be changed', async () => {
  const container = await triviality()
    .add(TestModule)
    .build();
  expect(() => {
    (container as any).testService = 1;
  }).toThrow('Container is locked and cannot be altered.');
});

it('Module is locked and cannot be changed', async () => {
  const container = await triviality()
    .add(TestModule)
    .build();
  expect(() => {
    container.changeMyself();
  }).toThrow('Container is locked and cannot be altered.');
});

it('Cannot fetched properties during build time', async () => {
  const serviceContainer = triviality()
    .add(TestModule)
    .add(class {
      constructor(container: Container<TestModule>) {
        container.testService();
      }
    });
  await expect(serviceContainer.build()).rejects.toEqual(
    new ContainerError('Container is locked. Cannot get or set services during build time.'));
});

it('Container cannot be rebuild', async () => {
  const container = triviality();
  await container.build();
  return expect(container.build()).rejects.toEqual(new ContainerError('Container already been build'));
});

it('Cannot add modules after it\'s build', async () => {
  const container = triviality();
  await container.build();
  return expect(() => container.add(TestModule)).toThrow('Container already been build');
});

it('Cannot have name coalitions', async () => {
  const container = triviality()
    .add(TestModule)
    .add(class {
      public halloService() {
        return 'hallo world';
      }
    } as any);
  await expect(container.build()).rejects.toThrow(
    ContainerError.propertyOrServiceAlreadyDefined('halloService').message);
});
