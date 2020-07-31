const getPreviousVersion = require('./utils').getPreviousVersion;
const execSync = require('child_process').execSync;
execSync(`npm deprecate future-flow@${getPreviousVersion()} deprecated`);
