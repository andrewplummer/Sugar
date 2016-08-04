var runner = require('../setup');

runner.load('../../packages/sugar-date');
runner.load('../../packages/sugar-date/locales');

// Tests
runner.loadTest('date');
runner.loadTest('range/date');
runner.loadLocaleTests();

runner.run(module);
