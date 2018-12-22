var runner = require('../setup');

runner.load('../../packages/sugar/polyfills');

Sugar = runner.load('../../packages/sugar');
runner.load('../../packages/sugar/locales');

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

runner.loadTest('es6/array');
runner.loadTest('es6/number');
runner.loadTest('es6/string');
runner.loadTest('es7/array');

runner.loadTest('range/date');
runner.loadTest('range/number');
runner.loadTest('range/string');

runner.loadLocaleTests();

runner.run(module, 'extended', Sugar);
