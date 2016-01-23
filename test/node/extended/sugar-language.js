var runner = require('../setup');

runner.load('../../release/npm/sugar-language');

// Tests
runner.loadTest('language');

runner.run(module, 'extended');
