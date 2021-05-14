import { generateFunctionFixed } from '../generateFunctionFixed';

it('generateFunctionFixed', () => {
  expect(generateFunctionFixed('%D:%e', [1, 2])).toMatchInlineSnapshot(
    `"2D:2e"`
  );

  expect(
    generateFunctionFixed('function%({{d%: number}}): [{{%f}}];', [1, 2, 3])
  ).toMatchInlineSnapshot(
    `"function3(d1: number, d2: number, d3: number): [1f, 2f, 3f];"`
  );
});
