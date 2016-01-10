var runner = require('../setup');

runner.resetPolyfills('es7');

runner.loadPackage('../../release/npm/sugar');

// Tests
runner.loadTest('es7');

runner.run(module);
