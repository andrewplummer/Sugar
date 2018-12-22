var runner = require('../setup');

Sugar = runner.load('../../packages/sugar-function');

// Tests
runner.loadTest('function');

runner.run(module, 'default', Sugar);
