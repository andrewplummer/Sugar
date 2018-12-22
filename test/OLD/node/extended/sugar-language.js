var runner = require('../setup');

Sugar = runner.load('../../packages/sugar-language');

// Tests
runner.loadTest('language');

runner.run(module, 'extended', Sugar);
