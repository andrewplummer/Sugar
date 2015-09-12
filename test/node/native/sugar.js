var runner = require('../setup');

// Tests
runner.loadTest('array');
runner.loadTest('date');
runner.loadTest('date_range');
runner.loadTest('enumerable');
runner.loadTest('equals');
runner.loadTest('es5');
runner.loadTest('es6');
runner.loadTest('function');
runner.loadTest('number');
runner.loadTest('number_range');
runner.loadTest('object');
runner.loadTest('regexp');
runner.loadTest('string');
runner.loadTest('string_range');

runner.runNative(module);
