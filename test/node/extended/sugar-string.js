var runner = require('../setup');

runner.load('../../packages/sugar-string');

// Tests
runner.loadTest('string');
runner.loadTest('range/string');

runner.run(module, 'extended');
