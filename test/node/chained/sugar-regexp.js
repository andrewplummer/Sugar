var runner = require('../setup');

runner.load('../../release/npm/sugar-regexp');

// Tests
runner.loadTest('regexp');

runner.run(module, 'chained');
