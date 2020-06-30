import { ValueMutex } from '../ValueMutex';
import Mutex from 'async-mutex/lib/Mutex';

it('Should be able to lock with async/await', async () => {
  const mutex1 = new Mutex();
  const vm = new ValueMutex<number>(1, mutex1);

  const [value, setValue] = await vm.acquire();
  expect(value).toEqual(1);
  setValue(2);
  expect(mutex1.isLocked()).toBeTruthy();
  vm.release();
  expect(mutex1.isLocked()).toBeFalsy();

  const [value2] = await vm.acquire();
  expect(value2).toEqual(2);
  vm.release();
});

it('Should not be able set value when lock is lifted', async () => {
  const mutex1 = new Mutex();
  const vm = new ValueMutex<number>(1, mutex1);

  const [value, setValue] = await vm.acquire();

  expect(mutex1.isLocked()).toBeTruthy();
  vm.release();

  expect(() => setValue(2)).toThrowError();

  const [value2] = await vm.acquire();
  expect(value).toEqual(1);
  expect(value2).toEqual(1);
  vm.release();
});
