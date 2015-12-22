var runner = require('../setup');

runner.loadPackage('../../release/npm/sugar/string');
runner.loadPackage('../../release/npm/sugar/range');

// Tests
runner.loadTest('string');
runner.loadTest('string-range');

runner.runExtended(module);
