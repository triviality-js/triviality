import * as os from 'os';

function createArrayOf(length: number): number[] {
  const arr = [];
  for (let j = 1; j <= length; j += 1) {
    arr.push(j);
  }
  return arr;
}

/**
 * Create complex add functions for ContainerFactory.
 *
 * public add<F1 extends FO<C, R>>(f1: FC<F1, C, R>): ContainerFactory<(C & FS<F1>), (R & FR<F1>)>;
 * public add<F1 extends FO<C, R>, F2 extends FO<C, R>>(f1: FC<F1, C & FS<F2>, R & FR<F2>>, f2: FC<F2, C & FS<F1>, R & FR<F1>>): ContainerFactory<(C & FS<F1> & FS<F2>), (R & FR<F1> & FR<F2>)>;
 */
function addArgumentTypes(args: number) {
  for (let i = 1; i <= args; i += 1) {
    const indexes = createArrayOf(i);
    const features = indexes.map((index) => `F${index} extends FO<C, R>`).join(', ');
    const registries = indexes.map((index) => `FR<F${index}>`).join(' & ');
    const argument = indexes.map((index) => {
      const otherFeature = indexes.filter(j => j !== index);
      const specificFeatureContainer = ['C'].concat(otherFeature.map((j) => `FS<F${j}>`)).join(' & ');
      const specificFeatureRegistries = ['R'].concat(otherFeature.map((j) => `FR<F${j}>`)).join(' & ');
      return `f${index}: FC<F${index}, ${specificFeatureContainer}, ${specificFeatureRegistries}>`;
    }).join(', ');
    const container = indexes.map((index) => `FS<F${index}>`).join(' & ');
    process.stdout.write(
      `public add<${features}>(${argument}): ContainerFactory<(C & ${container}), (R & ${registries})>;${os.EOL}`);
  }
}

/**
 * export type Container<M1 = null, M2 = null, R = (MR(M1) & MR(M2))> = C<M1>;
 */
function containerType(args: number) {
  const indexes = createArrayOf(args);
  const features = indexes.map((index) => `F${index} = null`).join(', ');
  const container = indexes.map((index) => `FS<F${index}>`).join(' & ');
  const featuresArgs = indexes.map((index) => `F${index}`).join(', ');
  const registries = indexes.map((index) => `FR<F${index}>`).join(' & ');
  process.stdout.write(`export type Container<${features}, R = (${registries})> = Readonly<${container}> & HasRegistries<R>;${os.EOL}`);
  process.stdout.write(`export type OptionalContainer
<${features}> = Optional<Container<${featuresArgs}>>;${os.EOL}`);
}

/**
 * export type Container<M1 = null, M2 = null, R = (MR(M1) & MR(M2))> = C<M1>;
 */
function registryType(args: number) {
  const indexes = createArrayOf(args);
  const features = indexes.map((index) => `F${index} = null`).join(', ');
  const featuresArgs = indexes.map((index) => `F${index}`).join(', ');
  const registries = indexes.map((index) => `FR<F${index}>`).join(' & ');
  process.stdout.write(`export type Registries<${features}> = Readonly<(${registries})>;${os.EOL}`);
  process.stdout.write(`export type OptionalRegistries<${features}> = Optional<Registries<${featuresArgs}>>;${os.EOL}`);
}

process.stdout.write(`Member: ${os.EOL}`);

addArgumentTypes(10);

process.stdout.write(`Container: ${os.EOL}`);

containerType(20);

process.stdout.write(`Registry: ${os.EOL}`);

registryType(20);
