import { requireConsoleInfoOutput } from '../../__test__/expectOutput';

it('Make sure example is not broken', async () => {
  const output = await requireConsoleInfoOutput(__dirname, '../LogModuleContainer.ts');
  expect(output).toBeCalledWith('Hallo word');
});
