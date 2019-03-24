import { map } from 'rxjs/operators';
import { DeserializationError } from '../Error/DeserializationError';
import { Observable } from 'rxjs';
import { SerializerInterface } from '../../Serializer/SerializerInterface';
import { SerializableCommand } from '../../CommandHandling/SerializableCommand';
import { MalformedSerializableCommandError } from '../Error/MalformedSerializableCommandError';
import { EntityMetadata } from '../../Redux/EntityMetadata';

export function deserializeCommand(serializer: SerializerInterface) {
  return (input: Observable<string>): Observable<{ command: SerializableCommand, metadata: EntityMetadata }> => {
    return input
      .pipe(
        map((json) => {
          let data: any;
          try {
            data = serializer.deserialize(json);
          } catch (e) {
            throw DeserializationError.commandCouldNotBeDeSerialized(json, e);
          }
          // First line of defence, we know we only can only receive SerializableCommands.
          if (SerializableCommand.isSerializableCommand(data.command)) {
            return data;
          }
          throw MalformedSerializableCommandError.notASerializableCommand(data.command);
        }),
      );
  };
}
