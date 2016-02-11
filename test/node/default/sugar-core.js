var runner = require('../setup');

var Sugar = runner.load('../../release/npm/sugar-core');

// Tests
runner.loadTest('core');

runner.run(module, 'default', Sugar);
