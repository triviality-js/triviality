/* tslint:disable:max-classes-per-file */

import { StoreError } from '../StoreError';

describe('StorageError', () => {

  it('Should throw original if already correct error', () => {
    const error = new StoreError('test');
    const fromError = StoreError.fromError(error);
    expect(fromError).toBe(error);
    expect(fromError.getOriginalError()).toBe(error);
  });

});
