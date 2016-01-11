var runner = require('../setup');

runner.load('../../release/npm/sugar-range');

// Tests
runner.loadTest('date-range');
runner.loadTest('number-range');
runner.loadTest('string-range');

runner.runExtended(module);
