import * as path from 'path';
import { exec } from 'child_process';

export async function executeFile(directory: string, tsFile: string, ...args: Array<string | number>): Promise<string> {
  return new Promise((resolve, reject) => {
    const file = path.join(directory, tsFile);
    exec(
      `bash -c "./node_modules/.bin/ts-node ${file} ${args.join(' ')}"`,
      (error, stdout, stderr) => {
        if (stdout.trim() === '') {
          throw new Error(`No output for file "${file} ${args.join(' ')}" ${error} ${stderr}`);
        }
        resolve(stdout + stderr);
        if (error !== null) {
          reject(`${stderr} ${error}`);
        }
      },
    );
  });
}
