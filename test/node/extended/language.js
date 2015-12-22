var runner = require('../setup');

runner.loadPackage('../../release/npm/sugar/language');

// Tests
runner.loadTest('language');

runner.runExtended(module);
