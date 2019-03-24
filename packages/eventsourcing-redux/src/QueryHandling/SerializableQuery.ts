/**
 * Marker class that a query is serializable.
 */
import { Query } from '@triviality/eventsourcing/QueryHandling/Query';

export abstract class SerializableQuery implements Query {

  /**
   * If the given query is an valid serializable query.
   */
  public static isSerializableQuery(query: unknown): query is SerializableQuery {
    return query instanceof this;
  }

}
