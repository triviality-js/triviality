import { Observable } from 'rxjs';
import { ReadModelAction } from './ReadModelAction';

export interface ActionStream<Action extends ReadModelAction = ReadModelAction> extends Observable<Action> {

}
