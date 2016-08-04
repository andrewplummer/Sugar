var runner = require('../setup');

var Sugar = runner.load('../../packages/sugar-core');

// Tests
runner.loadTest('core');

runner.run(module, 'default', Sugar);
