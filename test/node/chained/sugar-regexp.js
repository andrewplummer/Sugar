var runner = require('../setup');

runner.load('../../packages/sugar-regexp');

// Tests
runner.loadTest('regexp');

runner.run(module, 'chained');
