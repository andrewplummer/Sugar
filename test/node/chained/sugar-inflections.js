var runner = require('../setup');

Sugar = runner.load('../../packages/sugar-inflections');

// Tests
runner.loadTest('inflections');

runner.run(module, 'chained', Sugar);
