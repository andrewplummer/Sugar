var runner = require('./setup');

runner.notice('Core');
runner.load('./default/core.js');

runner.notice('Polyfills');
// Cannot practially run ES5 tests here as resetting
// native methods breaks the node require system.
runner.load('./default/es6.js');
runner.load('./default/es7.js');

runner.notice('Default');
runner.load('./default/sugar.js');

runner.notice('Extended');
runner.load('./extended/sugar.js');

runner.logTotals();
