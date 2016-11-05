var runner = require('../setup');

Sugar = runner.load('../../packages/sugar-date');
runner.load('../../packages/sugar-date/locales');

// Tests
runner.loadTest('date');
runner.loadTest('range/date');
runner.loadLocaleTests();

runner.run(module, 'extended', Sugar);
