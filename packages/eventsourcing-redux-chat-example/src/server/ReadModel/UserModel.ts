import { ReadModel } from '@triviality/eventsourcing/ReadModel/ReadModel';
import { UserId } from '../../shared/ValueObject/UserId';

export class UserModel implements ReadModel {

  constructor(private readonly userId: UserId, private name: string, private passwordHash: string) {

  }

  public getId(): UserId {
    return this.userId;
  }

  public getName(): string {
    return this.name;
  }

  public getPasswordHash(): string {
    return this.passwordHash;
  }
}
