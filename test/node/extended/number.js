var runner = require('../setup');

runner.load('../../release/npm/sugar/number');
runner.load('../../release/npm/sugar/range');

// Tests
runner.loadTest('number');
runner.loadTest('number-range');

runner.runExtended(module);
