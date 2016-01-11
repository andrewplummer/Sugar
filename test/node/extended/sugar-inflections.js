var runner = require('../setup');

runner.load('../../release/npm/sugar-inflections');

// Tests
runner.loadTest('inflections');

runner.runExtended(module);
