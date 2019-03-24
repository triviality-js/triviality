import { map } from 'rxjs/operators';
import { DeserializationError } from '../Error/DeserializationError';
import { Observable } from 'rxjs';
import { SerializerInterface } from '../../Serializer/SerializerInterface';
import { EntityMetadata } from '../../Redux/EntityMetadata';
import { SerializableQuery } from '../../QueryHandling/SerializableQuery';
import { MalformedSerializableQueryError } from '../Error/MalformedSerializableQueryError';

export function deserializeQuery(serializer: SerializerInterface) {
  return (input: Observable<string>): Observable<{ query: SerializableQuery, metadata: EntityMetadata }> => {
    return input
      .pipe(
        map((json) => {
          let data: any;
          try {
            data = serializer.deserialize(json);
          } catch (e) {
            throw DeserializationError.queryCouldNotBeDeSerialized(json, e);
          }
          // First line of defence, we know we only can only receive SerializableCommands.
          if (SerializableQuery.isSerializableQuery(data.query)) {
            return data;
          }
          throw MalformedSerializableQueryError.notASerializableQuery(data.query);
        }),
      );
  };
}
