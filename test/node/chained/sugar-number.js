var runner = require('../setup');

runner.load('../../release/npm/sugar-number');

// Tests
runner.loadTest('number');
runner.loadTest('range/number');

runner.run(module, 'chained');
