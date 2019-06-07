import { EntityMetadata } from '../EntityMetadata';
import { EntityName } from '../../ValueObject/EntityName';
import { Observable } from 'rxjs';
import { filter } from 'rxjs/operators';

export function withEntityName<Action extends { metadata: EntityMetadata }>(entity: EntityName) {
  return (input: Observable<Action>) => {
    return input.pipe(
      filter((action: Action) => {
        return action.metadata.entity === entity;
      }),
    );
  };
}
