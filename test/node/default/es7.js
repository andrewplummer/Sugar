var runner = require('../setup');

runner.resetPolyfills('es7');

// Need to load the polyfill package directly as node's internal
// require cache will prevent polyfills from being required later
// after they are blown away by the reset.
runner.load('../../release/npm/sugar/es7');

// Tests
runner.loadTest('es7');

runner.run(module);
