import { requireConsoleInfoOutput } from '../../__test__/expectOutput';

it('Make sure example is not broken', async () => {
  const output = await requireConsoleInfoOutput(__dirname, '../LogModuleContainer.ts', 2);
  expect(output).toHaveBeenCalledWith('John:', 'Hallo Jane!');
  expect(output).toHaveBeenCalledWith('Jane:', 'Hi John!');
});
