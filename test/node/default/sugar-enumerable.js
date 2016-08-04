var runner = require('../setup');

runner.load('../../packages/sugar-enumerable');

// Tests
runner.loadTest('enumerable');

runner.run(module);
