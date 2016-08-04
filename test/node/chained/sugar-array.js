var runner = require('../setup');

runner.load('../../packages/sugar-array');

// Tests
runner.loadTest('array');

runner.run(module, 'chained');
