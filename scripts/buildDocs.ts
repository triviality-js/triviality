import { exec } from 'child_process';
import * as find from 'find';
import * as fs from 'fs-extra';
import * as path from 'path';

const packageDirectory = path.join(__dirname, '..', 'packages');

// Remove old files.
find.file(/example\/.*\.md$/, packageDirectory, (files) => files.forEach((file) => fs.removeSync(file)));

// Create markdown files.
find.file(/example\/.*\.ts$/, packageDirectory, (files) => {
  files.map((file) => {
    const regex = /packages\/(.*)?\/example\/(.*\/)?(.+)\.ts/gm;
    const matches = regex.exec(file);
    if (matches === null) {
      throw new Error(`No match ${file}`);
    }
    createOutput(matches[1], matches[2] || '', matches[3], file);
  });
});

function createOutput(packageName: string, examplePath: string, exampleFileName: string, sourceFile: string) {
  const contents = fs.readFileSync(sourceFile).toString();
  const result = contents
    .replace(/'.*src.*'/gm, `'@triviality/${packageName}'`)
    .replace(/\.\/Example/gm, './docs/Example')
    .trim();

  const outDir = path.join(packageDirectory, packageName, 'example', examplePath, 'build');
  const outFile = path.join(outDir, `${exampleFileName}.md`);
  if (!fs.existsSync(outDir)) {
    fs.mkdirsSync(outDir);
  }
  const md = `
\`\`\`typescript
${result}
\`\`\`
        `;

  fs.writeFileSync(outFile.replace('.run', ''), md);

  const argsFile = path.join(packageDirectory, packageName, 'example', examplePath, 'build', exampleFileName, 'json');
  let args: { [key: string]: string } = { '': '' };
  if (fs.existsSync(argsFile)) {
    args = JSON.parse(fs.readFileSync(argsFile).toString());
  }

  Object.getOwnPropertyNames(args).forEach((name: string) => {
    const argsValue = args[name];
    executeFile('', sourceFile, argsValue).then((output) => {
      if (output === '') {
        return;
      }
      const outputMarkdown = `
\`\`\`bash
./node_modules/.bin/ts-node example/${examplePath}/${exampleFileName} ${argsValue}
${output.trim()}
\`\`\`
        `;
      const fileName = name === '' ? `${exampleFileName}_out.md` : `${exampleFileName}.${name}_out.md`;
      const argsFilePath = path.join(packageDirectory, packageName, 'example', examplePath, 'build', fileName);
      fs.writeFileSync(argsFilePath, outputMarkdown);
    }).catch((error) => {
      // tslint:disable-next-line
      console.error(error);
      process.exit(1);
    });
  });
}

function executeFile(directory: string, tsFile: string, ...args: Array<string | number>): Promise<string> {
  return new Promise((resolve, reject) => {
    const file = path.join(directory, tsFile);
    exec(
      `bash -c "./node_modules/.bin/ts-node ${file} ${args.join(' ')}"`,
      (error, stdout, stderr) => {
        resolve(stdout + stderr);
        if (error !== null) {
          reject(`${stderr} ${error}`);
        }
      },
    );
  });
}
