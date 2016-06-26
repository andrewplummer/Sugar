var runner = require('../setup');

runner.load('../../release/npm/sugar-enumerable');

// Tests
runner.loadTest('enumerable');

runner.run(module);
