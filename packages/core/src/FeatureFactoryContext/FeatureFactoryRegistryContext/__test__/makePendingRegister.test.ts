import { makePendingRegisterAdapter } from '../registerPending';
import { registerList } from '../registerList';

describe('registerPending', () => {

  it('Should pass argument to factory function ', () => {
    const originalList = jest.fn(registerList);
    const services = jest.fn(() => [1, 2]);
    const pendingList = makePendingRegisterAdapter(originalList, services);
    expect(originalList).not.toBeCalled();
    expect(services).not.toBeCalled();
    expect([...pendingList]).toEqual([1, 2]);
    expect(originalList).toBeCalledWith(services);
  });

  it('Should pass argument to registry function ', () => {
    const originalList = jest.fn(registerList);
    const services = jest.fn(() => [1, 2]);
    const pendingList = makePendingRegisterAdapter(originalList);
    pendingList.register(services);
    expect(originalList).not.toBeCalled();
    expect(services).not.toBeCalled();
    expect(pendingList()).toEqual([1, 2]);
    expect(originalList).toBeCalledWith();
  });

});
