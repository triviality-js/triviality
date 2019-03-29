import { InMemoryRepository } from '@triviality/eventsourcing/ReadModel/InMemoryRepository';
import { UserId } from '../../shared/ValueObject/UserId';
import { UserModel } from './UserModel';

export class UserModelRepository extends InMemoryRepository<UserModel, UserId> {

  public async findWithName(name: string): Promise<UserModel | null> {
    for (const id in this.models) {
      if (!this.models.hasOwnProperty(id)) {
        continue;
      }
      const model = this.models[id];
      if (model.getName() === name) {
        return model;
      }
    }
    return null;
  }

}
