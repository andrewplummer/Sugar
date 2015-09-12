var runner = require('../setup');

// Tests
runner.loadTest('date_range');
runner.loadTest('number_range');
runner.loadTest('string_range');

runner.run(module);
