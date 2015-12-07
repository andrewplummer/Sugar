var runner = require('../setup');

runner.loadPackage('../../release/npm/sugar/date');

// Tests
runner.loadTest('date');

runner.run(module);
