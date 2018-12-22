var runner = require('../setup');

Sugar = runner.load('../../packages/sugar-number');

// Tests
runner.loadTest('number');
runner.loadTest('range/number');

runner.run(module, 'chained', Sugar);
