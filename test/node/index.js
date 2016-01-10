var runner = require('./setup');

runner.exitOnFail(false);

runner.notice('Core Tests');

// Cannot practially run ES5 tests here as resetting
// native methods breaks the node require system.
runner.load('./default/es6.js');
runner.load('./default/es7.js');
runner.load('./default/core.js');

runner.notice('Packages (Default)');
runner.load('./default/sugar.js');

runner.notice('Packages (Extended)');
runner.load('./extended/sugar.js');

runner.logTotals();
