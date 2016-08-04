var runner = require('../setup');

runner.load('../../packages/sugar-object');

// Tests
runner.loadTest('object');
runner.loadTest('equals');

runner.run(module);
