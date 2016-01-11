var runner = require('../setup');

runner.load('../../release/npm/sugar-core');

// Tests
runner.loadTest('core');

runner.run(module);
