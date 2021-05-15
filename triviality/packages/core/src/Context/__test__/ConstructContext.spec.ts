import {createConstructContext} from "../ConstructContext";
import {CompileContext} from "../CompileContext";
import {createComposeContext} from "../ComposeContext";

class Test {
  public output: string

  constructor(greeter: string, name: string = 'John') {
    this.output = greeter + ' ' + name;
  }
}

it('Should be able to construct with key', () => {
  type T = {
    hi: string
  };

  const mock: CompileContext<T> = {
    getServiceFactory: jest.fn().mockReturnValue(() => 'hallo'),
    serviceReferenceFactory: (s: unknown) => s,
  } as unknown as CompileContext<T>;

  const context = createConstructContext<T>(mock);

  const result = context.construct(Test, 'hi');

  expect(mock.getServiceFactory).toBeCalledWith('hi');
  expect(result().output).toEqual('hallo John');
});

it('Allow Currying', () => {
  type T = {
    hi: string
  };

  const mock: CompileContext<T> = {
    getServiceFactory: jest.fn().mockReturnValue(() => 'hallo'),
    serviceReferenceFactory: (s: unknown) => s,
  } as unknown as CompileContext<T>;

  const context = createConstructContext<T>(mock);

  const result  = context.construct(Test);

  const output = result("hi");
  expect(output().output).toEqual('hallo John');
  expect(mock.getServiceFactory).toBeCalledWith('hi');

});


it('Construct key should exists', () => {
  type T = {};

  const mock: CompileContext<T> = {
    getServiceFactory: jest.fn((key: string) => () => {
      throw new Error(key + ' not exists');
    }),
    serviceReferenceFactory: (s: unknown) => s,
  } as unknown as CompileContext<T>;

  const context = createConstructContext<T>(mock);

  // @ts-expect-error
  const result = context.construct(Test, 'hi');

  expect(result).toThrowError('hi not exists')
});

it('Should be able to construct with keys', () => {
  type T = {
    greeter: string,
    name: string
  };

  const mock: CompileContext<T> = {
    getServiceFactory: jest.fn((key: string) => {
      if (key === 'greeter') {
        return () => 'Hallo';
      }
      if (key === 'name') {
        return () => 'John';
      }
      return null;
    }),
    serviceReferenceFactory: (s: unknown) => s,
  } as unknown as CompileContext<T>;

  const context = createConstructContext<T>(mock);



  const result = context.construct(Test, 'greeter', 'name');

  expect(result().output).toEqual('Hallo John');
});

it('Should be able to construct with sf', () => {
  type T = {};

  const mock: CompileContext<T> = {
    getServiceFactory: (s: unknown) => s,
    serviceReferenceFactory: (s: unknown) => s,
  } as unknown as CompileContext<T>;

  const context = createConstructContext<T>(mock);

  function directArg() {
    return 'hallo';
  }

  const result = context.construct(Test, directArg, () => 'eric');

  expect(result().output).toEqual('hallo eric');
});

