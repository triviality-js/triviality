import { projectionRecord } from '../../ReadModel/projectionRecord';
import { ReduxEventSourcingTestBench } from '../ReduxEventSourcingTestBench';

it('getReduxReadModelTestContext', () => {

  const tb = new ReduxEventSourcingTestBench();

  class MyState extends projectionRecord({}, 'MyState') {

  }

  const context = tb.getReduxReadModelTestContext(new MyState(), jest.fn().mockRejectedValue(new MyState()) as any);

  expect(tb.models.map.MyState).toBe(context);
});
