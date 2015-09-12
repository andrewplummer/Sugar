var runner = require('../setup');

// Tests
runner.loadTest('equals');
runner.loadTest('object');

runner.runNative(module);
