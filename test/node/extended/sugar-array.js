var runner = require('../setup');

runner.load('../../release/npm/sugar-array');

// Tests
runner.loadTest('array');

runner.run(module, 'extended');
