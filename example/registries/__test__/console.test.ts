import { executeFile } from '../../__test__/expectOutput';

it('Make sure example is not broken: Hallo', async () => {
  const output = await executeFile(__dirname, '../console.ts', 'hallo World');
  return expect(output).toMatch('Hallo World');
});

it('Make sure example is not broken: Bye', async () => {
  const output = await executeFile(__dirname, '../console.ts', 'bye John');
  return expect(output).toMatch('Bye John');
});
