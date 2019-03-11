export interface ConsoleInput {

  getArg(arg: number): string | undefined;
  getArg(arg: number, def: string): string;

}
