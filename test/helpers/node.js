const path = require('path');

module.exports = {
  expireCache: function(dir, p) {
    const fullPath = path.resolve(dir, p) + '.js';
    delete require.cache[fullPath];
  }
};
