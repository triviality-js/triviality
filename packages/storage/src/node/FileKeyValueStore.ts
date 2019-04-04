import * as fs from 'fs-extra';
import * as path from 'path';
import sanitize from 'sanitize-filename';
import { StoreError } from '../Error/StoreError';
import { KeyValueStoreInterface } from '../KeyValueStoreInterface';

export class FileKeyValueStore implements KeyValueStoreInterface<string, string> {

  constructor(private fileDirectory: string, private sanitizeFileName: (name: string) => string = sanitize) {

  }

  public clear(): this {
    fs.removeSync(this.fileDirectory);
    fs.ensureDirSync(this.fileDirectory);
    return this;
  }

  public delete(key: string): this {
    const sanitized = this.pathForKey(key);
    if (fs.existsSync(sanitized)) {
      fs.removeSync(sanitized);
    }
    return this;
  }

  public find(key: string): string | null {
    const sanitized = this.pathForKey(key);
    if (fs.existsSync(sanitized)) {
      return fs.readFileSync(sanitized).toString();
    }
    return null;
  }

  public get(key: string): string {
    const sanitized = this.pathForKey(key);
    if (!fs.existsSync(sanitized)) {
      throw StoreError.missingValueForKey(key);
    }
    return fs.readFileSync(sanitized).toString();
  }

  public has(key: string): boolean {
    const sanitized = this.pathForKey(key);
    return fs.existsSync(sanitized);
  }

  public set(key: string, value: string): this {
    const sanitized = this.pathForKey(key);
    fs.writeFileSync(sanitized, value);
    return this;
  }

  private pathForKey(key: string) {
    return path.join(this.fileDirectory, this.sanitizeFileName(key));
  }
}
