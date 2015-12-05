var runner = require('../setup');

runner.loadPackage('../../release/npm/sugar/array');

// Tests
runner.loadTest('array');
runner.loadTest('enumerable');

runner.run(module);
