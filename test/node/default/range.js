var runner = require('../setup');

// Tests
runner.loadTest('date-range');
runner.loadTest('number-range');
runner.loadTest('string-range');

runner.run(module);
