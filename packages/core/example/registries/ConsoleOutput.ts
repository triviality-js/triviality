export interface ConsoleOutput {
  info(...message: string[]): void;

  error(...message: string[]): void;
}
