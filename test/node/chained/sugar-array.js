var runner = require('../setup');

Sugar = runner.load('../../packages/sugar-array');

// Tests
runner.loadTest('array');

runner.run(module, 'chained', Sugar);
