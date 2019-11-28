import { range } from 'ramda';

const stack: string[] = [];

/**
 * Does not support async calls.
 */
export const watchCallStack = (...context: string[]) => <T extends () => R, R>(fn: T): () => R => {
  const text = context.join('.');
  return function (this: any, ...args: any[]) {
    // @ts-ignore
    stack.push(text);
    let result: any;
    try {
      result = (fn as any).apply(this, args);
    } catch (error) {
      if (error instanceof Error) {
        const stackText = currentCallStackTrace();
        const tracedError = new Error(`${stackText}${error.message}`);
        debugger
        tracedError.stack = error.stack;
        // tslint:disable-next-line:no-console
        console.error(tracedError);
        throw tracedError;
      }
      throw error;
    } finally {
      assertAndRemoveLastText(text);
    }
    return result;
  };
};

const assertAndRemoveLastText = (text: string) => {
  if (stack.pop() !== text) {
    throw new Error('Async calls');
  }
};

export const currentCallStack: () => string[] = () => [...stack];

const whitespace = (count: number) => range(0, count).map(() => ' ').join('');
export const currentCallStackTrace: () => string = () => stack.reduce(
  (acc, text, index) => `${whitespace(index)}${acc}${text}\n`, '');
