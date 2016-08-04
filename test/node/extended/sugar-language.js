var runner = require('../setup');

runner.load('../../packages/sugar-language');

// Tests
runner.loadTest('language');

runner.run(module, 'extended');
