var runner = require('../setup');

runner.resetPolyfills('es6');

// Need to load the polyfill package directly as node's internal
// require cache will prevent polyfills from being required later
// after they are blown away by the reset.
runner.loadPackage('../../release/npm/sugar/es6');

// Tests
runner.loadTest('es6');

runner.run(module);
