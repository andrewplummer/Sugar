var runner = require('../setup');

runner.resetPolyfills('es6');

// Tests
runner.loadTest('core');
runner.loadTest('array');
runner.loadTest('date');
runner.loadTest('date-range');
runner.loadTest('enumerable');
runner.loadTest('equals');
runner.loadTest('es5');
runner.loadTest('es6');
runner.loadTest('function');
runner.loadTest('number');
runner.loadTest('number-range');
runner.loadTest('object');
runner.loadTest('regexp');
runner.loadTest('string');
runner.loadTest('string-range');

runner.run(module);
