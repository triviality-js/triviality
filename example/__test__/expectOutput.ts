import * as path from 'path';
import { exec } from 'child_process';

export async function executeFile(directory: string, tsFile: string, ...args: Array<string|number>): Promise<string> {
  return new Promise((resolve, reject) => {
    const command = path.join(directory, tsFile);
    exec(
      `yarn ts-node ${command} ${args.join(' ')}`,
      (error, stdout, stderr) => {
        resolve(stdout);
        if (error !== null) {
          reject(`${stderr} ${error}`);
        }
      },
    );
  });
}
