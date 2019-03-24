import { RecordWithPlayhead } from '../PlayheadRecord';
import { PlayheadError } from '../Error/PlayheadError';

interface MyStateInterface {
  counter: number;
}

const defaultMyState: MyStateInterface = {
  counter: 0,
};

class MyState extends RecordWithPlayhead<MyStateInterface>(defaultMyState, 'MyState') {
  public increase() {
    return this.set('counter', this.counter + 1);
  }
}

it('Can create custom playheadhead class', () => {
  const state = new MyState();
  const withCounts = state.increase().increase();
  expect(withCounts.get('counter')).toBe(2);
  expect(withCounts).toBeInstanceOf(MyState);
});

it('Has playhead function', () => {
  const state = new MyState();
  const record = state
    .setPlayhead(1)
    .setPlayhead(2);
  expect(record.get('playhead')).toBe(2);
  expect(record.setPlayhead(3).playhead).toBe(3);
});

it('Playhead should throw error when its not increased', () => {
  const state = new MyState();
  expect(state.get('playhead')).toBe(0);
  expect(() => state.setPlayhead(4)).toThrowError(PlayheadError.doesNotMatch(0, 4).message);
});
