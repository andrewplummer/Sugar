var runner = require('../setup');

runner.loadPackage('../../release/npm/sugar/array');

// Tests
runner.loadTest('es5');
runner.loadTest('es6');
runner.loadTest('array');
runner.loadTest('enumerable');

runner.run(module);
