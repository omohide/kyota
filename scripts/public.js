// @ts-check

// eslint-disable-next-line @typescript-eslint/no-var-requires
const fs = require('fs-extra');

fs.copy('./public', './dist');
