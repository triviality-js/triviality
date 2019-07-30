import 'jest';
import { ContainerError } from '../Error/ContainerError';
import { triviality } from '../index';

export const TestFeature = () => ({
  services: {
    testService() {
      return ['Test service'];
    },

    halloService(...names: string[]) {
      return { hallo: () => `Hallo ${names.join(' ')}` };
    },

    changeMyself() {
      this.testService = () => ['Changed!?'];
    },
  },
});

it('Container is locked and cannot be changed', async () => {
  const container = await triviality()
    .add(TestFeature)
    .build();
  expect(() => {
    (container as any).testService = 1;
  }).toThrow(ContainerError.containerIsLocked().message);
});

it('Feature is locked and cannot be changed', async () => {
  const container = await triviality()
    .add(TestFeature)
    .build();
  expect(() => {
    container.changeMyself();
  }).toThrow(ContainerError.containerIsLocked().message);
});

it('Cannot fetched properties during build time', async () => {
  const serviceContainer = triviality()
    .add(TestFeature)
    .add(({ halloService }) => halloService() as any);
  await expect(serviceContainer.build()).rejects.toEqual(ContainerError.containerIsLockedDuringBuild());
});

it('Cannot have name coalitions', async () => {
  await expect(
    triviality()
      .add(TestFeature)
      .add(TestFeature)
      .build(),
  ).rejects.toThrow(
    ContainerError.serviceAlreadyDefined('testService').message,
  );
});
