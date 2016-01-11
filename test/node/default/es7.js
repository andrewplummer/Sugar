var runner = require('../setup');

runner.resetPolyfills('es7');

runner.load('../../release/npm/sugar-es7');

// Tests
runner.loadTest('es7');

runner.run(module);
