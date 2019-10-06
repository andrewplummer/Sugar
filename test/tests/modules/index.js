import path from 'path';

const base = path.resolve(__dirname, '../../../src');

function clearCache() {
  Object.keys(require.cache).forEach(key => {
    if (key.indexOf(base) !== -1) {
      delete require.cache[key];
    }
  });
}

// To correctly test modules we need to clear the require
clearCache();
require('./main-entry');
clearCache();
require('./namespace-entry');
clearCache();
require('./method-entry');
clearCache();
require('./customized');
clearCache();
require('./plugin');
