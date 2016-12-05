var runner = require('../setup');

runner.resetPolyfills('b64');
runner.resetPolyfills('es6');
runner.resetPolyfills('es7');

Sugar = runner.load('../../dist/sugar');
runner.loadAll('../../dist/locales');

// Polyfill tests
runner.loadTest('es6/array');
runner.loadTest('es6/number');
runner.loadTest('es6/string');
runner.loadTest('es7/array');

// Tests
runner.loadTest('core');
runner.loadTest('array');
runner.loadTest('date');
runner.loadTest('equals');
runner.loadTest('function');
runner.loadTest('number');
runner.loadTest('object');
runner.loadTest('regexp');
runner.loadTest('string');
runner.loadTest('enumerable');

runner.loadTest('range/date');
runner.loadTest('range/number');
runner.loadTest('range/string');

runner.loadLocaleTests();

runner.run(module, 'default', Sugar);
