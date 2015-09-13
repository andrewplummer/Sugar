var runner = require('../setup');

// Tests
runner.loadTest('date-range');
runner.loadTest('number-range');
runner.loadTest('string-range');

runner.runExtended(module);
