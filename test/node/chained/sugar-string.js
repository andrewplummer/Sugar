var runner = require('../setup');

Sugar = runner.load('../../packages/sugar-string');

// Tests
runner.loadTest('string');
runner.loadTest('range/string');

runner.run(module, 'chained', Sugar);
