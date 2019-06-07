import { ClassUtil } from '@triviality/eventsourcing/ClassUtil';
import { QueryConstructor } from '@triviality/eventsourcing/QueryHandling/Query';
import { ClassConstructor } from '@triviality/serializer';

export class InvalidQueryTypeError extends Error {

  public static actionIsNotAnQueryAction() {
    return new this('Action is not a query action');
  }

  public static doesNotMatchQuery(query: any, Query: QueryConstructor) {
    return new this(`Query ${ClassUtil.nameOffInstance(query)} is not an instance of ${ClassUtil.nameOffConstructor(Query)}`);
  }

  public static doesNotHaveResponse(query: any) {
    return new this(`Query response action ${ClassUtil.nameOffInstance(query)} is missing response value`);
  }

  public static doesNotHaveCorrectResponse(query: any, Response: ClassConstructor<any>) {
    return new this(`Query response action ${ClassUtil.nameOffInstance(query)} does not have correct response ${ClassUtil.nameOffConstructor(Response)}`);
  }
}
