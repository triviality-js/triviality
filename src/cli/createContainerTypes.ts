import * as os from 'os';

function createArrayOf(length: number): number[] {
  const arr = [];
  for (let j = 1; j <= length; j += 1) {
    arr.push(j);
  }
  return arr;
}

/**
 *
 * public add<M1 extends MO<R>, M2 extends MO<R>, NC = (C & SM<M1> & SM<M2>), NR = (R & MR<M1> & MR<M2>)>(_m1: MC<M1, NC>, _m2: MC<M2, NC>): ContainerFactory<NC, NR>;
 */
function addArgumentTypes(args: number) {
  for (let i = 1; i <= args; i += 1) {
    const indexes = createArrayOf(i);
    const type = indexes.map((index) => `M${index} extends MO<R>`).join(', ');
    const registries = indexes.map((index) => `MR<M${index}>`).join(' & ');
    const argument = indexes.map((index) => {
      const specificModuleContainer = ['C'].concat(indexes.filter(j => j !== index).map((j) => `SM<M${j}>`)).join(' & ');
      return `m${index}: MC<M${index}, ${specificModuleContainer}>`;
    }).join(', ');
    const container = indexes.map((index) => `SM<M${index}>`).join(' & ');
    process.stdout.write(
      `public add<${type}, NC = (C & ${container}), NR = (R & ${registries})>(${argument}): ContainerFactory<NC, NR>;${os.EOL}`);
  }
}

/**
 *
 * export type Container<M1 = {}> = C<M1>;
 */
function partialContainer(args: number) {
  const indexes = createArrayOf(args);
  const type = indexes.map((index) => `M${index} = {}`).join(', ');
  const container = indexes.map((index) => `C<M${index}>`).join(' & ');
  process.stdout.write(`export type Container<${type}> = ${container};${os.EOL}`);
}

process.stdout.write(`Member: ${os.EOL}`);

addArgumentTypes(10);

process.stdout.write(`Container: ${os.EOL}`);

partialContainer(20);
