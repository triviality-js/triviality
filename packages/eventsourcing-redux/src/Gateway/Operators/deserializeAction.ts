import { map } from 'rxjs/operators';
import { DeserializationError } from '../Error/DeserializationError';
import { Observable } from 'rxjs';
import { SerializerInterface } from '../../Serializer/SerializerInterface';
import { isSerializableAction, SerializableAction } from '../../Redux/SerializableAction';
import { MalformedSerializableActionError } from '../Error/MalformedSerializableActionError';

export function deserializeAction(serializer: SerializerInterface) {
  return (input: Observable<string>): Observable<SerializableAction> => {
    return input
      .pipe(
        map((json) => {
          let action;
          try {
            action = serializer.deserialize(json);
          } catch (e) {
            throw DeserializationError.eventCouldNotBeDeSerialized(json, e);
          }
          if (!isSerializableAction(action)) {
            throw MalformedSerializableActionError.notASerializableAction(action);
          }
          return action;
        }),
      );
  };
}
