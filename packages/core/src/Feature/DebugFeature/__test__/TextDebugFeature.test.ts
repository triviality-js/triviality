import triviality, { FF } from '../../../index';
import { TextDebugFeature } from '../TextDebugFeature';

it('Without any services', async () => {
  const dependencyContainer = await triviality()
    .add(TextDebugFeature)
    .build();
  expect(dependencyContainer.getDependencyTree()).toMatchSnapshot();
});

interface Services {
  a: string;

  b: string;

  c: string;

  abc: string;

  nested: string;
}

const ComplexFeature: FF<Services> = function CF({ services }) {
  const [a, b, c, abc] = services('a', 'b', 'c', 'abc');

  return ({
    a: () => 'a',
    b: () => 'b',
    c: () => 'c',
    single: () => a(),
    ab: () => a() + b(),
    abc: () => a() + b() + c(),
    nested: () => abc(),
  });
};

it('With complex dependencies', async () => {
  const dependencyContainer = await triviality()
    .add(TextDebugFeature)
    .add(ComplexFeature)
    .build();
  expect(dependencyContainer.getDependencyTree()).toMatchSnapshot();
});
