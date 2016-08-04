var runner = require('../setup');

runner.load('../../packages/sugar-inflections');

// Tests
runner.loadTest('inflections');

runner.run(module, 'extended');
