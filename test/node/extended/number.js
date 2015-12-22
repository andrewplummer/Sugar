var runner = require('../setup');

runner.loadPackage('../../release/npm/sugar/number');
runner.loadPackage('../../release/npm/sugar/range');

// Tests
runner.loadTest('number');
runner.loadTest('number-range');

runner.runExtended(module);
