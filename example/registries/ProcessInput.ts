import { ConsoleInput } from './ConsoleInput';

export class ProcessInput implements ConsoleInput {

  public getArg(arg: number): string | undefined;
  public getArg(arg: number, def: string): string;
  public getArg(arg: number, def?: string): string | undefined {
    return process.argv.slice(2)[arg] || def;
  }

}
