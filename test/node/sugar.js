var runner = require('./setup');

runner.notice('Default');
runner.load('./default/sugar.js');

runner.notice('Chained');
runner.load('./chained/sugar.js');

runner.notice('Extended');
runner.load('./extended/sugar.js');

runner.logTotals();
