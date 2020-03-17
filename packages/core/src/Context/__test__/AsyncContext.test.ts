import triviality, { FF } from '../../index';

it('Can use async service as synchronise service', async () => {
  interface MyFeatureService {
    foo: number;
  }

  const MyFeature: FF<MyFeatureService> = ({ synchronize }) => {
    return {
      foo: synchronize(async () => {
        return 1;
      }),
    };
  };
  const result = await triviality()
    .add(MyFeature)
    .build();
  expect(result.foo).toEqual(1);
});

it('Can depend on async services as if they where synchronise service', async () => {
  interface MyFeatureService {
    foo: string;
    bar: string;
  }

  const MyFeature: FF<MyFeatureService> = ({ synchronize }) => {
    return {
      foo() {
        return `foo-${this.bar()}`;
      },
      bar: synchronize(async () => {
        return 'bar';
      }),
    };
  };
  const result = await triviality()
    .add(MyFeature)
    .build();
  expect(result.foo).toEqual('foo-bar');
});

interface MyAsyncFeatureService {
  foo: string;
  bar: string;
  aa: string;
  bb: string;
}

const MyAsyncFeature: FF<MyAsyncFeatureService> = ({ synchronize, instance }) => {
  return {
    foo() {
      return `foo-${this.bar()}-${instance('aa')}`;
    },
    bar: synchronize(async () => {
      return 'bar';
    }),
    aa: synchronize(async () => {
      return `aa-${instance('bb')}`;
    }),
    bb: synchronize(async () => {
      return `bb-${instance('bar')}`;
    }),
  };
};
it('Can depend nested async services as if they where synchronise service', async () => {
  const result = await triviality()
    .add(MyAsyncFeature)
    .build();
  expect(result.foo).toEqual('foo-bar-aa-bb-bar');
});

it('Can merge async services', async () => {
  const MergedFeature: FF<MyAsyncFeatureService> = ({ merge }) => {
    return merge(MyAsyncFeature).all();
  };
  const result = await triviality()
    .add(MergedFeature)
    .build();
  expect(result.foo).toEqual('foo-bar-aa-bb-bar');
});

it('Can catch errors', async () => {
  interface MyFeatureService {
    foo: number;
  }

  const MyFeature: FF<MyFeatureService> = ({ synchronize }) => {
    return {
      foo: synchronize(async () => {
        throw new Error('Hi!');
      }),
    };
  };
  const result = triviality()
    .add(MyFeature)
    .build();
  await expect(result).rejects.toThrow('Hi!');
});

it('Can catch referenced errors', async () => {
  interface MyFeatureService {
    foo: string;
    bar: string;
  }

  const MyFeature: FF<MyFeatureService> = ({ synchronize }) => {
    return {
      foo: synchronize(async () => {
        throw new Error('foo');
      }),
      bar() {
        return `${this.foo()}-bar`;
      },
    };
  };
  const result = triviality()
    .add(MyFeature)
    .build();
  await expect(result).rejects.toThrow('foo');
});
