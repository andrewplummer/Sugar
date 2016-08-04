var runner = require('../setup');

Sugar = runner.load('../../dist/sugar');
runner.loadAll('../../dist/locales');

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

runner.loadTest('range/date');
runner.loadTest('range/number');
runner.loadTest('range/string');

runner.loadLocaleTests();

runner.run(module, 'chained', Sugar);
