var runner = require('../setup');

runner.resetPolyfills('es6');
runner.resetPolyfills('es7');

runner.load('../../release/npm/sugar');
runner.load('../../release/npm/sugar/locales');

// Tests
runner.loadTest('array');
runner.loadTest('date');
runner.loadTest('equals');
runner.loadTest('function');
runner.loadTest('number');
runner.loadTest('object');
runner.loadTest('regexp');
runner.loadTest('string');
runner.loadTest('enumerable');

runner.loadTest('es6');
runner.loadTest('es7');

runner.loadTest('range/date');
runner.loadTest('range/number');
runner.loadTest('range/string');

runner.loadLocaleTests();

runner.run(module, 'extended');
