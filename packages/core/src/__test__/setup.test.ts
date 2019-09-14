import { register, triviality } from '../index';

it('Execute setup step', async () => {
  const spySetup = jest.fn();
  await triviality()
    .add(() => ({
      setup: register(() => [() => {
        spySetup();
        return Promise.resolve();
      }]),
    }))
    .build();
  expect(spySetup).toBeCalled();
});

it('Catches setup step error', async () => {
  const spySetup = jest.fn();
  const container = triviality()
    .add(() => ({
      setup: register(() => [() => {
        spySetup();
        return Promise.reject('Some error');
      }]),
    }))
    .build();
  expect(spySetup).toBeCalled();

  await expect(container).rejects.toEqual('Some error');
  expect(spySetup).toBeCalled();
});
