var runner = require('../setup');

runner.resetPolyfills('es6');

runner.load('../../release/npm/sugar-number');

// Tests
runner.loadTest('es6');
runner.loadTest('number');
runner.loadTest('range/number');

runner.run(module);
