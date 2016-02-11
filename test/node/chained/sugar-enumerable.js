var runner = require('../setup');

runner.resetPolyfills('es6');
runner.resetPolyfills('es7');

runner.load('../../release/npm/sugar-enumerable');

// Tests
runner.loadTest('es6');
runner.loadTest('es7');
runner.loadTest('enumerable');

runner.run(module, 'chained');
