import { exec } from 'child_process';
import * as path from 'path';
import * as fs from 'fs';
// @ts-ignore
import * as markdownInclude from 'markdown-include';

const name = process.cwd().split('/').slice(-1)[0];

markdownInclude.registerPlugin({
  pattern: /^######typescript ".+"/gm,
  replace: (tag: string) => {
    const matches = /"(.*)"/gm.exec(tag);
    if (!matches) {
      throw new Error('No matches found.');
    }
    const file = matches[1];
    const data = fs.readFileSync(file).toString();
    const result = data
      .replace(/'.*src.*'/gm, `'@triviality/${name}'`)
      .replace(/\.\/Example/gm, './docs/Example')
      .trim();
    return `
\`\`\`typescript
${result}
\`\`\`
        `;
  },
});

const promises: Array<Promise<{ tag: string, result: string }>> = [];

markdownInclude.registerPlugin({
  pattern: /^######ts-node ".+"(\(.*\))?.*/gm,
  replace: (tag: string) => {
    const matches = /"(.*?)"(\((.*)\))?/gm.exec(tag);
    if (!matches) {
      throw new Error(`No matches found. ${tag}`);
    }
    const file = matches[1];
    const args = matches[3];
    promises.push(executeFile('', file, args)
      .then((result: string) => {
        return {
          tag,
          result: `
\`\`\`bash
./node_modules/.bin/ts-node ${file} ${args ? args : ''}
${result.trim()}
\`\`\`
        `,
        };
      }));
    return tag;
  },
});

markdownInclude
  .compileFiles('./markdown.json')
  .then(async (data: string) => {
    const results = await Promise.all(promises);
    let endResult = data;
    results.forEach(({ tag, result }) => {
      endResult = endResult.replace(tag, result);
    });
    fs.writeFileSync('README.md', endResult);
  })
  .catch((error: any) => {
    process.stderr.write(error.toString());
    process.exit(1);
  });

export async function executeFile(directory: string, tsFile: string, ...args: Array<string|number>): Promise<string> {
  return new Promise((resolve, reject) => {
    const file = path.join(directory, tsFile);
    exec(
      `bash -c "./../../node_modules/.bin/ts-node --project "./../../base-tsconfig.json"  ${file} ${args.join(' ')}"`,
      (error, stdout, stderr) => {
        if (stdout.trim() === '') {
          throw new Error(`No output for file ${file} ${error} ${stderr}`);
        }
        resolve(stdout + stderr);
        if (error !== null) {
          reject(`${stderr} ${error}`);
        }
      },
    );
  });
}
