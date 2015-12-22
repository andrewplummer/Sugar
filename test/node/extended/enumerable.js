var runner = require('../setup');

runner.loadPackage('../../release/npm/sugar/enumerable');

// Tests
runner.loadTest('enumerable');

runner.runExtended(module);
