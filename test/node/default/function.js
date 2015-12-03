var runner = require('../setup');

runner.loadPackage('../../release/npm/sugar/function');

// Tests
runner.loadTest('function');

runner.run(module);
