var runner = require('../setup');

runner.load('../../release/npm/sugar-object');

// Tests
runner.loadTest('object');
runner.loadTest('equals');

runner.run(module, 'chained');
