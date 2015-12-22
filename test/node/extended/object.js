var runner = require('../setup');

runner.loadPackage('../../release/npm/sugar/object');

// Tests
runner.loadTest('object');
runner.loadTest('equals');

runner.runExtended(module);
