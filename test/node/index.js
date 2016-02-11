var runner = require('./setup');

runner.notice('Core');
runner.load('./default/sugar-core.js');

runner.notice('Polyfills');
// Cannot practially run ES5 tests here as resetting
// native methods breaks the node require system.
runner.load('./default/sugar-es6.js');
runner.load('./default/sugar-es7.js');

runner.notice('Default');
runner.load('./default/default.js');

runner.notice('Chained');
runner.load('./chained/default.js');

runner.notice('Extended');
runner.load('./extended/default.js');

runner.logTotals();
