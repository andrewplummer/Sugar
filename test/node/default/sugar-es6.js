var runner = require('../setup');

runner.resetPolyfills('es6');

runner.load('../../release/npm/sugar-es6');

// Tests
runner.loadTest('es6/array');

runner.run(module);
