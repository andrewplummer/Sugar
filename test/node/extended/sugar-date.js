var runner = require('../setup');

runner.load('../../release/npm/sugar-date');
runner.load('../../release/npm/sugar-date/locales');

// Tests
runner.loadTest('date');
runner.loadTest('range/date');
runner.loadLocaleTests();

runner.run(module, 'extended');
