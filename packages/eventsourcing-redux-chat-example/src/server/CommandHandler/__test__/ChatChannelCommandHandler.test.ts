import { EventSourcingTestBench } from '@triviality/eventsourcing/Testing';
import * as bcrypt from 'bcrypt';
import { toArray } from 'rxjs/operators';
import { UserId } from '../../../shared/ValueObject/UserId';
import { UserAggregate } from '../../Aggregate/UserAggregate';
import { UserRegisterCommand } from '../../Command/UserRegisterCommand';
import { UserHasRegistered } from '../../DomainEvent/UserHasRegistered';
import { UserModel } from '../../ReadModel/UserModel';
import { UserModelRepository } from '../../ReadModel/UserModelRepository';
import { UserRegisterCommandHandler } from '../UserRegisterCommandHandler';

it('Should handle registration', () => {

  const userId = UserId.create();

  return EventSourcingTestBench
    .create()
    .givenReadModelRepository(UserModel, () => {
      return new UserModelRepository();
    })
    .givenCommandHandler((testBench: EventSourcingTestBench) => {
      return new UserRegisterCommandHandler(
        testBench.getAggregateRepository(UserAggregate),
        testBench.getReadModelRepository(UserModel) as any,
      );
    })
    .whenCommands([new UserRegisterCommand(userId, 'John Doe', 'Password 1234')])
    .thenAssert(async (testBench) => {
      const store = testBench.getEventStore(UserAggregate);
      const events = await store.loadAll().pipe(toArray()).toPromise();
      const event: UserHasRegistered = events[0].payload as any;
      expect(event.name).toBe('John Doe');
      const equals = await bcrypt.compare('Password 1234', event.passwordHash);
      expect(equals).toBeTruthy();
    });

});
