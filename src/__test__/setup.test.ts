import { ContainerFactory } from '../ContainerFactory';
import { Module } from '../Module';

describe('ContainerFactory', () => {

  it('Execute setup step', async () => {
    const spyConstructor = jest.fn();
    const spySetup = jest.fn();
    const container = await ContainerFactory
      .create()
      .add(class implements Module {
        constructor(private constructor: {}) {
          spyConstructor(constructor);
        }

        public setup() {
          spySetup(this.constructor);
          return Promise.resolve();
        }
      }).build();

    expect(spyConstructor).toBeCalledWith(container);
    expect(spySetup).toBeCalledWith(container);
  });

  it('Execute non-async setup step', async () => {
    const spyConstructor = jest.fn();
    const spySetup = jest.fn();
    const container = await ContainerFactory
      .create()
      .add(class implements Module {
        constructor(private constructor: {}) {
          spyConstructor(constructor);
        }

        public setup() {
          spySetup(this.constructor);
        }
      }).build();

    expect(spyConstructor).toBeCalledWith(container);
    expect(spySetup).toBeCalledWith(container);
  });

  it('Catches async setup step error', async () => {
    const spyConstructor = jest.fn();
    const spySetup = jest.fn();
    const container = ContainerFactory
      .create()
      .add(class implements Module {
        constructor(private constructor: {}) {
          spyConstructor(constructor);
        }

        public setup() {
          spySetup(this.constructor);

          return Promise.reject('Some error');
        }
      }).build();

    await expect(container).rejects.toEqual('Some error');

    expect(spyConstructor).toBeCalled();
    expect(spySetup).toBeCalled();
  });

  it('Catches non-async setup step error', async () => {
    const spyConstructor = jest.fn();
    const spySetup = jest.fn();
    const container = ContainerFactory
      .create()
      .add(class implements Module {
        constructor(private constructor: {}) {
          spyConstructor(constructor);
        }

        public setup() {
          spySetup(this.constructor);

          throw new Error('Some error');
        }
      }).build();

    await expect(container).rejects.toThrowError('Some error');

    expect(spyConstructor).toBeCalled();
    expect(spySetup).toBeCalled();
  });

});
