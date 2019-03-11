/* tslint:disable:max-classes-per-file */

import { SerializerError } from '../SerializerError';

describe('SerializerError', () => {

  it('Should throw original if already correct error', () => {
    const error = new SerializerError('test');
    const fromError = SerializerError.fromError(error);
    expect(fromError).toBe(error);
    expect(fromError.getOriginalError()).toBe(error);
  });

});
