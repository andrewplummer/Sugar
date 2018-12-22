var runner = require('../setup');

Sugar = runner.load('../../packages/sugar-range');

// Tests
runner.loadTest('range/date');
runner.loadTest('range/number');
runner.loadTest('range/string');

runner.run(module, 'extended', Sugar);
