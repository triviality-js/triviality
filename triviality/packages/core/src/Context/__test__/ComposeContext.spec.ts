import {createComposeContext} from "../ComposeContext";
import {CompileContext} from "../CompileContext";
import {USF} from "@triviality/core";
import { __ } from "../Curry";

it('Should be able to compose with key', () => {
  type T = {
    hi: string
  };

  const mock: CompileContext<T> = {
    getServiceFactory: jest.fn().mockReturnValue(() => 'hallo'),
    serviceReferenceFactory: (s: unknown) => s,
  } as unknown as CompileContext<T>;

  const context = createComposeContext<T>(mock);

  const test = (arg: string): string =>  arg + ' eric';

  const result = context.compose(test, 'hi');

  expect(mock.getServiceFactory).toBeCalledWith('hi');
  expect(result()).toEqual('hallo eric');
});

it('Compose key should exists', () => {
  type T = {};

  const mock: CompileContext<T> = {
    getServiceFactory: jest.fn((key: string) => () => {
      throw new Error(key + ' not exists');
    }),
    serviceReferenceFactory: (s: unknown) => s,
  } as unknown as CompileContext<T>;

  const context = createComposeContext<T>(mock);

  const test = (arg: string): string =>  arg + ' eric';

  // @ts-expect-error
  const result = context.compose(test, 'hi');

  expect(result).toThrowError('hi not exists')
});

it('Compose argument can be curried', () => {
  type T = {
    greetings: string;
  };

  const mock: CompileContext<T> = {
    getServiceFactory: (key: string | USF) => {
      if (typeof key === 'function') {
        return key;
      }
      if (key === 'greetings') {
        return () => 'Hi';
      }
      throw new Error(key + ' not exists');
    },
    serviceReferenceFactory: (s: unknown) => s,
  } as unknown as CompileContext<T>;

  const context = createComposeContext<T>(mock);

  const test = (arg: string): string =>  arg + ' eric';

  const newVar = context.compose(test)(() => 'Hallo');
  expect(newVar()).toEqual('Hallo eric');
  expect(context.compose(test)('greetings')()).toEqual('Hi eric');
});

const TestFunctionWithAge = (greetings: string, name: string, age: number): string => `${greetings} ${name} (${age})`;

it('Compose argument can be curried complex', () => {
  type T = {
    greetings: string;
    name: string;
    age: number;
  };

  const mock: CompileContext<T> = {
    getServiceFactory: (key: string | USF) => {
      if (typeof key === 'function') {
        return key;
      }
      if (key === 'greetings') {
        return () => 'What\'s up';
      }
      if (key === 'name') {
        return () => 'Jane';
      }
      throw new Error(key + ' not exists');
    },
    serviceReferenceFactory: (s: unknown) => s,
  } as unknown as CompileContext<T>;

  const context = createComposeContext<T>(mock);

  const a = context.compose(TestFunctionWithAge)(__, __, () => 23);
  const b = a(__, 'name');
  const c = b('greetings');
  expect(c()).toEqual('What\'s up Jane (23)');
});

it('Compose argument can be curried directly', () => {
  const mock: CompileContext<unknown> = {
    getServiceFactory: (key: string | USF) => {
      if (typeof key === 'function') {
        return key;
      }
      throw new Error(key + ' not exists');
    },
    serviceReferenceFactory: (s: unknown) => s,
  } as unknown as CompileContext<unknown>;

  const context = createComposeContext<unknown>(mock);
  const d = context.compose(TestFunctionWithAge, __, () => 'Groot', () => 203);

  expect(d(() => 'I AM')()).toEqual('I AM Groot (203)');
});

it('Compose argument can be curried indefinitely', () => {
  const mock: CompileContext<unknown> = {
    getServiceFactory: (key: string | USF) => {
      if (typeof key === 'function') {
        return key;
      }
      throw new Error(key + ' not exists');
    },
    serviceReferenceFactory: (s: unknown) => s,
  } as unknown as CompileContext<unknown>;

  const context = createComposeContext<unknown>(mock);
  const d = context.compose(TestFunctionWithAge);


  // Typing still work.

  // @ts-expect-error
  d(() => 1);

  // @ts-expect-error
  d(() => "", () => 1);


  const yeeAaa = d()()()();

  // @ts-expect-error
  yeeAaa(() => 1);


  expect(yeeAaa(() => 'I AM', () => 'Groot', () => 12)()).toEqual('I AM Groot (12)');
});


it('Should be able to compose with keys', () => {
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

  const context = createComposeContext<T>(mock);

  const test = (greeter: string, name: string): string => greeter + ' ' + name;

  const result = context.compose(test, 'greeter', 'name');

  expect(result()).toEqual('Hallo John');
});


it('Should be able to compose async with keys', async () => {
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

  const context = createComposeContext<T>(mock);

  const test = async (greeter: string, name: string): Promise<string> => greeter + ' ' + name;

  const result = context.compose(test, 'greeter', 'name');

  expect(await result()).toEqual('Hallo John');
});


it('Should be able to compose with sf', () => {
  type T = {};

  const mock: CompileContext<T> = {
    getServiceFactory: (s: unknown) => s,
    serviceReferenceFactory: (s: unknown) => s,
  } as unknown as CompileContext<T>;

  const context = createComposeContext<T>(mock);

  const test = (arg: string): string =>  arg + ' eric';

  function directArg() {
    return 'hallo';
  }

  const result = context.compose(test, directArg);

  expect(result()).toEqual('hallo eric');
});

