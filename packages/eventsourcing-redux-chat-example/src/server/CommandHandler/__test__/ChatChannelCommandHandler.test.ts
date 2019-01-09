import { EventSourcingTestBench } from 'ts-eventsourcing/Testing';
import { UserRegisterCommandHandler } from '../UserRegisterCommandHandler';
import { UserAggregate } from '../../Aggregate/UserAggregate';
import { UserId } from '../../../shared/ValueObject/UserId';
import { UserRegisterCommand } from '../../Command/UserRegisterCommand';
import { toArray } from 'rxjs/operators';
import { UserHasRegistered } from '../../DomainEvent/UserHasRegistered';
import * as bcrypt from 'bcrypt';
import { UserModel } from '../../ReadModel/UserModel';

it('Should handle registration', () => {

  const userId = UserId.create();

  return EventSourcingTestBench
    .create()
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
