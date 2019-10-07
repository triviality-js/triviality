import { registerList, RegistryList } from '../registerList';
import { registerPending } from '../registerPending';

it('Should pass argument to factory function ', () => {
  const originalList: (toReg: () => [number, number]) => RegistryList<number> = jest.fn(registerList) as any;
  const services: () => [number, number] = jest.fn(() => [1, 2]);
  const pendingList = registerPending(originalList, services);
  expect(originalList).not.toBeCalled();
  expect(services).not.toBeCalled();
  expect([...pendingList]).toEqual([1, 2]);
  expect(originalList).toBeCalledWith(services);
});

it('Should pass argument to registry function ', () => {
  const originalList: () => RegistryList<number> = jest.fn(registerList) as any;
  const services = jest.fn(() => [1, 2]);
  const pendingList = registerPending(originalList);
  pendingList.register(services);
  expect(originalList).not.toBeCalled();
  expect(services).not.toBeCalled();
  expect(pendingList()).toEqual([1, 2]);
  expect(originalList).toBeCalledWith();
});
