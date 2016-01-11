var runner = require('../setup');

runner.load('../../release/npm/sugar');
runner.load('../../release/npm/sugar/inflections');
runner.load('../../release/npm/sugar/language');
runner.load('../../release/npm/sugar/locales');

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
runner.loadTest('inflections');
runner.loadTest('language');

runner.loadTest('number-range');
runner.loadTest('string-range');
runner.loadTest('date-range');

// Locales
runner.loadLocaleTests()

runner.run(module);
