var runner = require('../setup');

runner.load('../../packages/sugar-number');

// Tests
runner.loadTest('number');
runner.loadTest('range/number');

runner.run(module, 'extended');
