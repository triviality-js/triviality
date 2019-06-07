import * as fs from 'fs';
import * as path from 'path';
/* tslint:disable:no-var-requires */
const exec = require('child-process-promise').exec;

export async function compileTs(directory: string, ts: string): Promise<string> {
  const tmp = path.join(directory, 'tmp.ts');
  if (fs.existsSync(tmp)) {
    fs.unlinkSync(tmp);
  }
  fs.writeFileSync(tmp, ts);
  try {
    const result = await exec(`yarn ts-node --no-cache ${tmp}`);
    fs.unlinkSync(tmp);
    return result.stdout.toString();
  } catch (e) {
    fs.unlinkSync(tmp);
    return Promise.reject(e.stderr.toString());
  }
}

export async function declarationOfTs(directory: string, ts: string): Promise<string> {
  const tmp = path.join(directory, 'tmp.ts');
  if (fs.existsSync(tmp)) {
    fs.unlinkSync(tmp);
  }
  fs.writeFileSync(tmp, ts);
  try {
    await exec('yarn tsc');
    fs.unlinkSync(tmp);
    const featureFile = tmp
      .replace('src', 'build/src')
      .replace('.ts', '.d.ts');
    return fs.readFileSync(featureFile,
    ).toString();
  } catch (e) {
    fs.unlinkSync(tmp);
    return Promise.reject(e.toString());
  }
}
