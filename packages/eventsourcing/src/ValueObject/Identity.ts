
export interface Identity {
  toString(): string;
}

export type IdentityConstructor<Id extends Identity> = new (...args: any[]) => Id;
