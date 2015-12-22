var runner = require('../setup');

runner.loadPackage('../../release/npm/sugar/regexp');

// Tests
runner.loadTest('regexp');

runner.runExtended(module);
