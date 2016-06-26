var runner = require('../setup');

runner.load('../../release/npm/sugar-string');

// Tests
runner.loadTest('string');
runner.loadTest('range/string');

runner.run(module, 'chained');
