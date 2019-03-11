import findUp from 'find-up';
import * as fs from 'fs';

export class PackageVersionReader {
  public async readVersion(): Promise<string> {
    const file = await findUp('package.json');
    if (!file) {
      throw new Error('package.json not found');
    }
    const json = JSON.parse(fs.readFileSync(file).toString());
    if (!json || typeof json !== 'object' || typeof json.version !== 'string') {
      throw new Error(`invalid json file ${file}`);
    }
    return json.version;
  }
}
