import * as fs from 'fs';
import * as path from 'path';
const exec = require('child-process-promise').exec;

export async function compileTs(directory: string, ts: string): Promise<string> {
  const tmp = path.join(directory, 'tmp.ts');
  if (fs.existsSync(tmp)) {
    fs.unlinkSync(tmp);
  }
  fs.writeFileSync(tmp, ts);
  try {
    const result = await exec(`node_modules/.bin/ts-node ${tmp}`);
    fs.unlinkSync(tmp);
    return result.stdout.toString();
  } catch (e) {
    fs.unlinkSync(tmp);
    return Promise.reject(e.stderr.toString());
  }
}
