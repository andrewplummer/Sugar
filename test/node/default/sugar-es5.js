var runner = require('../setup');

runner.resetPolyfills('es5');

Sugar = runner.load('../../packages/sugar-es5');

// Tests
runner.loadTest('es5/array');
runner.loadTest('es5/date');
runner.loadTest('es5/function');
runner.loadTest('es5/object');
runner.loadTest('es5/string');

runner.run(module, 'default', Sugar);
