var runner = require('../setup');

// Tests
runner.loadTest('es5');
runner.loadTest('array');
runner.loadTest('enumerable');

runner.run(module);
