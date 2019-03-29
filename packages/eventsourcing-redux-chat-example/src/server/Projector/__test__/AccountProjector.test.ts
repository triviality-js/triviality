import { ReduxEventSourcingTestBench } from '@triviality/eventsourcing-redux/Testing/ReduxEventSourcingTestBench';
import { accountReducer } from '../../../client/Account/accountReducer';
import { AccountState } from '../../../client/Account/AcountState';
import { UserId } from '../../../shared/ValueObject/UserId';
import { UserHasRegistered } from '../../DomainEvent/UserHasRegistered';
import { AccountProjector } from '../AccountProjector';
import { AccountGatewayFactory } from '../Gateway/AccountGatewayFactory';

it('Handle registration', async () => {
  const id = new UserId('cb8b715e-738b-49a1-9829-7f8d6ba54f9c');
  const tb = await ReduxEventSourcingTestBench
    .create()
    .givenTestLogger();

  await tb.givenEventListener((testBench: ReduxEventSourcingTestBench) => {
    return new AccountProjector(new AccountGatewayFactory(testBench.createActionGatewayFactory(new AccountState(), accountReducer)));
  });

  await tb.whenEventsHappened(id, [
    new UserHasRegistered('John doe', 'password hash'),
  ]);

  await tb.thenAssert(async (testBench) => {
    const action = testBench.createAction(id, id, 'Account', new UserHasRegistered('John doe', 'password hash'));
    await testBench.thenActionsShouldBeTransmitted([action]);
  });
});

it('Cannot register same id twice', async () => {
  const id = new UserId('cb8b715e-738b-49a1-9829-7f8d6ba54f9c');
  await ReduxEventSourcingTestBench
    .create()
    .givenTestLogger()
    .givenEventListener((testBench: ReduxEventSourcingTestBench) => {
      return new AccountProjector(new AccountGatewayFactory(testBench.createActionGatewayFactory(new AccountState(), accountReducer)));
    })
    .throws()
    .whenEventsHappened(id, [
      new UserHasRegistered('John doe', 'password hash'),
      new UserHasRegistered('John doe', 'password hash'),
    ]);
});
