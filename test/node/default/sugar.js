var runner = require('../setup');

runner.loadPackage('../../release/npm/sugar');

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

runner.loadTest('number-range');
runner.loadTest('string-range');
runner.loadTest('date-range');

runner.run(module);
