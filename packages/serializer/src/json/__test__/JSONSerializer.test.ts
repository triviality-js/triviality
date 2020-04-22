import { JSONSerializer } from '../JSONSerializer';

it('Can serializer', () => {
  const serializer = new JSONSerializer();
  expect(
    serializer.serialize({
      foo: 1,
    }),
  ).toMatchInlineSnapshot(`
    "{
      \\"foo\\": 1
    }"
  `);
});

it('Can de-serializer', () => {
  const serializer = new JSONSerializer();
  expect(serializer.deserialize('{"foo": 1}')).toMatchInlineSnapshot(`
    Object {
      "foo": 1,
    }
  `);
});
