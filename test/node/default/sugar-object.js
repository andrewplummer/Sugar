var runner = require('../setup');

Sugar = runner.load('../../packages/sugar-object');

// Tests
runner.loadTest('object');
runner.loadTest('equals');

runner.run(module, 'default', Sugar);
