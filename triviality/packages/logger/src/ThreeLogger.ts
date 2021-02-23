import { LoggerInterface, LogLevel } from './LoggerInterface';
import { find, dropRight, findLast } from 'lodash';
import { AbstractLogLevelLogger } from './AbstractLogLevelLogger';

export interface ThreeLoggerOptions<T> {
  eq: (a: T, b: T) => boolean;
  print: (reference: T) => string;
}

type PrintedReference<T = unknown> = {
  ref: T,
  ignored: false;
  stringRef: string;
  printed: boolean;
  prefix: string;
};

type IgnoredReference<T = unknown> = {
  ref: T,
  ignored: true;
};

type Reference<T> = PrintedReference<T> | IgnoredReference<T>;

/**
 * Three logging.
 *
 * a:Hi
 *   Whatsapp
 *   b:Hi!
 *     Whatsapp
*    test
 */
export class ThreeLogger<T = unknown> extends AbstractLogLevelLogger implements LoggerInterface {
  private references: Reference<T>[] = [];

  public static create<T = unknown>(logger: LoggerInterface, options?: Partial<ThreeLoggerOptions<T>>): ThreeLogger<T> {
    return new this<T>(logger, {
      eq: (a, b) => a === b,
      print: (ref) => `${ref}:`,
      ...options,
    });
  }

  public increaseBy(reference: T) {
    const {eq, print} = this.options;
    const previousRef = findLast(this.references, ({ignored}) => !ignored ) as PrintedReference<T>;
    if (!previousRef) {
      const stringRef = print(reference);
      this.references.push({
        ref: reference,
        ignored: false,
        stringRef: stringRef,
        printed: false,
        prefix: ''
      });
    } else if (eq(previousRef.ref, reference)) {
      const stringRef = print(reference);
      this.references.push({
        ref: reference,
        ignored: false,
        stringRef: stringRef,
        printed: false,
        prefix: previousRef.prefix + [...stringRef].map(() => ' '),
      });
    } else {
      this.references.push({
        ref: reference,
        ignored: true,
      });
    }
  }

  public decrease() {
    dropRight(this.references);
  }

  public decreaseBy(reference: T) {
    const found = findLast(this.references, (ref) => ref.ref === reference);
    if (!found) {
      throw new Error('Reference not found');
    }
    this.references = this.references.slice(0, this.references.indexOf(found));
  }

  constructor(private readonly logger: LoggerInterface,
              private readonly options: ThreeLoggerOptions<T>) {
    super();
  }

  public log(level: LogLevel, message?: unknown, ...optionalParams: unknown[]) {
    this.printRefs(level);
    const previousRef = findLast(this.references, (ref) => !ref.ignored) as PrintedReference;
    this.logger.log(level, previousRef.prefix + message, ...optionalParams);
  }

  private printRefs(level: LogLevel) {
    const previousRef = find(this.references, (ref) => !ref.ignored && !ref.printed) as PrintedReference;
    if (previousRef) {
      previousRef.printed = true;
      this.logger.log(level, previousRef.prefix.slice(0, -previousRef.stringRef.length), `${previousRef.stringRef}`);
      this.printRefs(level);
    }
  }
}
