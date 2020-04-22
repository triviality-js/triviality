export interface Command {

}

export type CommandConstructor<T = Command> = new (...args: any[]) => T;
