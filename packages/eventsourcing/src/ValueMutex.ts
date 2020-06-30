import { MutexInterface } from 'async-mutex';

export class ValueMutex<T> {
  private lastSetValue: number = 0;

  constructor(private value: T, private mutex: MutexInterface) {
  }

  public async runExclusive<R>(callback: (value: T, setValue: (value: T) => void) => Promise<R> | R): Promise<R> {
    return this.mutex.runExclusive(() => callback(this.value, this.createSetValue()));
  }

  public async acquire(): Promise<[T, (value: T) => void]> {
    return this.mutex.acquire().then(() => [this.value, this.createSetValue()]);
  }

  public release() {
    this.lastSetValue += 1;
    this.mutex.release();
  }

  private createSetValue() {
    this.lastSetValue += 1;
    const lastSetValue = this.lastSetValue;
    return (newValue: T) => {
      if (lastSetValue !== this.lastSetValue) {
        throw new Error('Set value from wrong acquire');
      }
      return this.value = newValue;
    };
  }
}
