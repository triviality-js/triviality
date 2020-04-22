import { asReference } from '../ReferenceContext';
import triviality from '../../index';

it('Can create reference service function', async () => {
  const result = await
    triviality().add(
      () => {
        const foo = asReference(() => 1);
        return {
          foo,
          bar: () => foo(),
        };
      },
    ).build();
  expect(result.foo).toEqual(1);
  expect(result.bar).toEqual(1);
});

it('Can override reference service function', async () => {
  const result = await
    triviality()
      .add(
        () => {
          const foo = asReference(() => 1);
          return {
            foo,
            bar: () => foo(),
          };
        },
      )
      .add(({ override: { foo: overrideFoo } }) => ({
        ...overrideFoo(() => 2),
      }))
      .build();
  expect(result.foo).toEqual(2);
  expect(result.bar).toEqual(2);
});
