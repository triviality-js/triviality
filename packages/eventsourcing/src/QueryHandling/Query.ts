export interface Query {

}

export type QueryConstructor<T = Query> = new (...args: any[]) => T;
