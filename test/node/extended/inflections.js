var runner = require('../setup');

runner.loadPackage('../../release/npm/sugar/string');
runner.loadPackage('../../release/npm/sugar/inflections');

// Tests
runner.loadTest('inflections');

runner.runExtended(module);
