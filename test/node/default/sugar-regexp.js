var runner = require('../setup');

Sugar = runner.load('../../packages/sugar-regexp');

// Tests
runner.loadTest('regexp');

runner.run(module, 'default', Sugar);
