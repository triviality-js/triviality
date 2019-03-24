import { concat, Observable, of } from 'rxjs';
import { ActionStream } from './ActionStream';
import { ReadModelAction } from './ReadModelAction';

export class SimpleActionStream<Action extends ReadModelAction = ReadModelAction>
  extends Observable<Action> implements ActionStream<Action> {

  public static of<Action extends ReadModelAction = ReadModelAction>(events: Action[] = []) {
    return new this<Action>(of(...events));
  }

  constructor(private readonly events$: Observable<Action>) {
    super(events$.subscribe.bind(events$));
  }

  public append(eventstream: ActionStream<Action>): this {
    const combined$ = concat(this.events$, eventstream);
    return new SimpleActionStream<Action>(combined$) as any;
  }

}
