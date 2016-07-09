var runner = require('../setup');

runner.load('../../release/npm/sugar-function');

// Tests
runner.loadTest('function');

runner.run(module, 'chained');
