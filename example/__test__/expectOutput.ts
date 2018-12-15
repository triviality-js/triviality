import * as path from 'path';

export async function requireConsoleInfoOutput(directory: string, tsFile: string, calls: number = 1): Promise<jest.Mock> {
  return new Promise((resolve, reject) => {
    try {
      const info = (console as any).info;
      const spy = jest.fn(() => {
        if (spy.mock.calls.length < calls) {
          return;
        }
        (console as any).info = info;
        resolve(spy);
      });
      (console as any).info = spy;
      require(path.join(directory, tsFile));
    } catch (e) {
      reject(e);
    }
  });

}
