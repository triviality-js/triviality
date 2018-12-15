const fs = require("fs");
const markdownInclude = require('markdown-include');

markdownInclude.registerPlugin({
    pattern: /^#typescript ".+"/gm,
    replace: function (tag) {
        const file = /"(.*)"/gm.exec(tag)[1];
        const data = fs.readFileSync(file).toString();
        const result = data
            .replace( /'.*src.*'/gm, `'triviality'`)
            .replace(/\.\/Example/gm, './docs/Example')
            .trim();
        return `
\`\`\`typescript
${result}
\`\`\`
        `;
    }
});

markdownInclude
    .compileFiles('./markdown.json')
    .then(function (data) {
        // do something after compiling
        console.log('Done!');
    })
    .catch(function (error) {
        console.log('Error!', error);
    });
