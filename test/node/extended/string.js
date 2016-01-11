var runner = require('../setup');

runner.resetPolyfills('es6');

runner.load('../../release/npm/sugar-string');

// Tests
runner.loadTest('es6');
runner.loadTest('string');

runner.runExtended(module);
