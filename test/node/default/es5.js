var runner = require('../setup');

runner.resetPolyfills('es5');

runner.loadPackage('../../release/npm/sugar/es5');

// Tests
runner.loadTest('es5');

runner.run(module);
