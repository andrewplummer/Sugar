var runner = require('../setup');

runner.load('../../release/npm/sugar-inflections');

// Tests
runner.loadTest('inflections');

runner.run(module, 'chained');
