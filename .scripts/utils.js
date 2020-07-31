module.exports = {
    getPreviousVersion: function() {
        const fs = require('fs-extra');
        const WORK_DIR = process.cwd();

        fs.copyFileSync(
            `${WORK_DIR}/dist/index.html`,
            `${WORK_DIR}/demo/index.html`
        );
        const packageJson = JSON.parse(
            fs.readFileSync(`${WORK_DIR}/package.json`, {
                encoding: 'utf-8',
            })
        );
        const versionTokens = packageJson.version.split('.');
        const patchTokens = versionTokens[2].split('-');
        const patch = parseInt(patchTokens[1]);

        const previousVersion =
            versionTokens[0] +
            '.' +
            versionTokens[1] +
            '.' +
            patchTokens[0] +
            '-' +
            (patch - 1);
        return previousVersion;
    },
};
