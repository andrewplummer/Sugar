var runner = require('../setup');

runner.resetPolyfills('es6');

runner.loadPackage('../../release/npm/sugar');

// Tests
runner.loadTest('es6');

runner.run(module);
