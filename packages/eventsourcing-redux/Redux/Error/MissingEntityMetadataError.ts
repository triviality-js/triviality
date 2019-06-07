import { ClassUtil } from '@triviality/eventsourcing/ClassUtil';
import { ServerGatewayMessage } from '../../Gateway/ValueObject/ServerGatewayMessage';

export class MissingEntityMetadataError extends Error {

  public static forGatewayMessage(message: ServerGatewayMessage) {
    return new this(`Gateway message ${ClassUtil.nameOffInstance(message.payload)} is missing entity name`);
  }

}
