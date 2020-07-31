const fs = require('fs-extra');
const WORK_DIR = process.cwd();

//READ PACKAGE.JSON
const packageJsonString = fs.readFileSync(`${WORK_DIR}/package.json`, {
    encoding: 'utf-8',
});
const packageJson = JSON.parse(packageJsonString);

//UPDATE DEMO
fs.removeSync(`${WORK_DIR}/demo/index.html`);
fs.copyFileSync(`${WORK_DIR}/dist/index.html`, `${WORK_DIR}/demo/index.html`);
let indexHtml = fs.readFileSync(`${WORK_DIR}/demo/index.html`, {
    encoding: 'utf-8',
});
indexHtml = indexHtml.replace(
    'src="future-flow.js"',
    `src="https://unpkg.com/future-flow@${packageJson.version}/dist/future-flow.js"`
);
fs.writeFileSync(`${WORK_DIR}/demo/index.html`, indexHtml, {
    encoding: 'utf-8',
});

//UPDATE README
let readme = fs.readFileSync(`${WORK_DIR}/README.md`, {
    encoding: 'utf-8',
});
const regex = new RegExp(
    `https://unpkg.com/future-flow@${packageJson.version}/dist/future-flow.js`,
    'gi'
);
readme = readme.replace(
    regex,
    `https://unpkg.com/future-flow@${packageJson.version}/dist/future-flow.js`
);
fs.writeFileSync(`${WORK_DIR}/README.md`, readme, {
    encoding: 'utf-8',
});
