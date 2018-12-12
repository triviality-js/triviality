import * as os from 'os';

function createArrayOf(length: number): number[] {
  const arr = [];
  for (let j = 1; j <= length; j += 1) {
    arr.push(j);
  }
  return arr;
}

function argumentTypes(args: number, staticFunc: boolean) {
  for (let i = 1; i <= args; i += 1) {
    const indexes = createArrayOf(i);
    const type = indexes.map((index) => `M${index} extends M`).join(', ');
    const container = indexes.map((index) => `W<M${index}>`).concat(staticFunc ? [] : ['T']).join(' & ');
    const argument = indexes.map((index) => {
      return `m${index}: MC<M${index}, C>`;
    }).join(', ');
    process.stdout.write(
      `public ${staticFunc ? 'static' : ''} add<${type}, C extends (${container})>(${argument}): ContainerFactory<C>;${os.EOL}`);
  }
}

function partialContainer(args: number) {
  const indexes = createArrayOf(args);
  const type = indexes.map((index) => `M${index} = {}`).join(', ');
  const container = indexes.map((index) => `W<M${index}>`).join(' & ');
  process.stdout.write(`export type Container<${type}> = ${container};${os.EOL}`);
}

process.stdout.write(`Member: ${os.EOL}`);

argumentTypes(10, false);

process.stdout.write(`Static: ${os.EOL}`);

argumentTypes(10, true);

process.stdout.write(`Container: ${os.EOL}`);

partialContainer(20);
