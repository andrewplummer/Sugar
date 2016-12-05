var runner = require('./setup');

runner.notice('Default');
runner.load('./default/dist.js');

runner.notice('Chained');
runner.load('./chained/dist.js');

runner.notice('Extended');
runner.load('./extended/dist.js');

runner.logTotals(true);
