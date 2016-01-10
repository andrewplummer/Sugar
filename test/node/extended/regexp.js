var runner = require('../setup');

runner.load('../../release/npm/sugar/regexp');

// Tests
runner.loadTest('regexp');

runner.runExtended(module);
