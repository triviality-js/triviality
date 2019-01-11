import * as os from 'os';

function createArrayOf(length: number): number[] {
  const arr = [];
  for (let j = 1; j <= length; j += 1) {
    arr.push(j);
  }
  return arr;
}

/**
 * Create complex extra arguments.
 *
 * public add<D1 extends DO<C, R>, NC = (C & SD<D1>), NR = (R & DR<D1>)>(d1: DC<D1, C, R>): ContainerFactory<NC, NR>;
 * public add<D1 extends DO<C, R>, D2 extends DO<C, R>, NC = (C & SD<D1> & SD<D2>), NR = (R & DR<D1> & DR<D2>)>(d1: DC<D1, C & SD<D2>, R & DR<D2>>, d2: DC<D2, C & SD<D1>, R & DR<D1>>): ContainerFactory<NC, NR>;
 */
function addArgumentTypes(args: number) {
  for (let i = 1; i <= args; i += 1) {
    const indexes = createArrayOf(i);
    const type = indexes.map((index) => `F${index} extends FO<C, R>`).join(', ');
    const registries = indexes.map((index) => `FR<F${index}>`).join(' & ');
    const argument = indexes.map((index) => {
      const otherFeature = indexes.filter(j => j !== index);
      const specificFeatureContainer = ['C'].concat(otherFeature.map((j) => `FS<F${j}>`)).join(' & ');
      const specificFeatureRegistries = ['R'].concat(otherFeature.map((j) => `FR<F${j}>`)).join(' & ');
      return `f${index}: FC<F${index}, ${specificFeatureContainer}, ${specificFeatureRegistries}>`;
    }).join(', ');
    const container = indexes.map((index) => `FS<F${index}>`).join(' & ');
    process.stdout.write(
      `public add<${type}, NC = (C & ${container}), NR = (R & ${registries})>(${argument}): ContainerFactory<NC, NR>;${os.EOL}`);
  }
}

/**
 * export type Container<M1 = null, M2 = null, R = (MR(M1) & MR(M2))> = C<M1>;
 */
function partialContainer(args: number) {
  const indexes = createArrayOf(args);
  const feature = indexes.map((index) => `F${index} = null`).join(', ');
  const container = indexes.map((index) => `C<F${index}>`).join(' & ');
  const registries = indexes.map((index) => `FR<F${index}>`).join(' & ');
  process.stdout.write(`export type Container<${feature}, R = (${registries})> = Readonly<${container}> & HasRegistries<R>;${os.EOL}`);
}

process.stdout.write(`Member: ${os.EOL}`);

addArgumentTypes(10);

process.stdout.write(`Container: ${os.EOL}`);

partialContainer(20);
