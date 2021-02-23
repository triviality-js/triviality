import {AsyncError, handleAsyncError} from "../AsyncError";

describe('handleAsyncError', () => {
  it('Should wait for resolve', async () => {
    let resolved = false;
    const promise = new Promise<void>((resolve) => {
      setTimeout(() => {
        resolve();
        resolved = true;
      }, 1)
    });
    const retry = jest.fn();
    const error = new AsyncError(promise, retry);
    expect(resolved).toBeFalsy();
    await handleAsyncError(error);
    expect(resolved).toBeTruthy();
  });

  it('Should retry for resolve', async () => {
    let rejected = false;
    let resolved = false;
    const promise = new Promise<void>((resolve, reject) => {
      setTimeout(() => {
        rejected = true;
        reject(new AsyncError(Promise.resolve(), jest.fn()));
      }, 1)
    });
    const retry = jest.fn(() => {
      return new Promise<void>((resolve) => {
        setTimeout(() => {
          resolve();
          resolved = true;
        }, 1)
      });
    });
    const error = new AsyncError(promise, retry);
    expect(rejected).toBeFalsy();
    expect(resolved).toBeFalsy();
    await handleAsyncError(error);
    expect(rejected).toBeTruthy();
    expect(resolved).toBeTruthy();
  });



  it('Should retry nested error first', async () => {
    const responses: string[] = [];

    function createRetry(name: string, ...fails: Array<() => Promise<void>>): () => Promise<void> {
      let count = 0;
      return async () => {
        const type = count === 0 ? 'promise' : `retry ${count}`;
        if (fails.length <= count) {
          responses.push(`${name}: Resolve ${type}`);
          return Promise.resolve();
        }
        responses.push(`${name}: Reject ${type}`);
        const retry = fails[count];
        const promise = fails[count]();
        count++;
        return Promise.reject(new AsyncError(promise, retry))
      };
    }


    const last = createRetry('1',
      createRetry('2',
        createRetry('2.1'),
        createRetry('2.2',
          createRetry('2.2.1'),
          createRetry('2.2.2'),
          createRetry('3',
            createRetry('3.1',
              createRetry('3.1.1',
                createRetry('3.1.1.1'),
                createRetry('3.1.1.2'),
                createRetry('3.1.1.3')
              )
            ),
          ),
        )
      ),
    );


    await handleAsyncError(await last().catch((e) => e));
    expect(responses).toEqual([
      "1: Reject promise",
      "2: Reject promise",
      "2.1: Resolve promise",
      "2.1: Resolve promise",
      "2: Reject retry 1",
      "2.2: Reject promise",
      "2.2.1: Resolve promise",
      "2.2.1: Resolve promise",
      "2.2: Reject retry 1",
      "2.2.2: Resolve promise",
      "2.2.2: Resolve promise",
      "2.2: Reject retry 2",
      "3: Reject promise",
      "3.1: Reject promise",
      "3.1.1: Reject promise",
      "3.1.1.1: Resolve promise",
      "3.1.1.1: Resolve promise",
      "3.1.1: Reject retry 1",
      "3.1.1.2: Resolve promise",
      "3.1.1.2: Resolve promise",
      "3.1.1: Reject retry 2",
      "3.1.1.3: Resolve promise",
      "3.1.1.3: Resolve promise",
      "3.1.1: Resolve retry 3",
      "3.1: Resolve retry 1",
      "3: Resolve retry 1",
      "2.2: Resolve retry 3",
      "2: Resolve retry 2"
    ]);
  });

});
