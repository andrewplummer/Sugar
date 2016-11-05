var runner = require('../setup');

Sugar = runner.load('../../packages/sugar-enumerable');

// Tests
runner.loadTest('enumerable');

runner.run(module, 'extended', Sugar);
