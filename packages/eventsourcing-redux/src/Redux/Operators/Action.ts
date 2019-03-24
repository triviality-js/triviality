import { Observable } from 'rxjs';
import { filter } from 'rxjs/operators';
import { AnyAction } from 'redux';

export function ofType<T extends AnyAction>(...type: string[]) {
  return (input: Observable<T>) => {
    return input.pipe(filter(action => type.indexOf(action.type) >= 0));
  };
}
