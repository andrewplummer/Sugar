var runner = require('../setup');

Sugar = runner.load('../../packages/sugar-core');

// Tests
runner.loadTest('core');

runner.run(module, 'default', Sugar);
