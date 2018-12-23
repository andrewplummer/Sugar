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
// cache and dynamically import with require each time.

clearCache();
require('./sugar-entry');
clearCache();
require('./sugar-all');
clearCache();
require('./namespace-entry');
clearCache();
require('./namespace-all');
clearCache();
require('./method-entry');
clearCache();
require('./method-define');
clearCache();
require('./customized');
clearCache();
require('./plugin');
