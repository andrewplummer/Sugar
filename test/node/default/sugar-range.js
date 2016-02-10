var runner = require('../setup');

runner.load('../../release/npm/sugar-range');

// Tests
runner.loadTest('range/date');
runner.loadTest('range/number');
runner.loadTest('range/string');

runner.run(module);
