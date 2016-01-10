var runner = require('../setup');

runner.resetPolyfills('es6');
runner.resetPolyfills('es7');

runner.load('../../release/npm/sugar-array');

// Tests
runner.loadTest('es6');
runner.loadTest('es7');
runner.loadTest('array');

runner.run(module);
