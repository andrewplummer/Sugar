var runner = require('../setup');

runner.load('../../packages/sugar-function');

// Tests
runner.loadTest('function');

runner.run(module);
