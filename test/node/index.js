var runner = require('./setup');

runner.resetPolyfills('es6');
runner.resetPolyfills('es7');

runner.notice('Default');
runner.load('./default/dist.js');

runner.notice('Chained');
runner.load('./chained/dist.js');

runner.notice('Extended');
runner.load('./extended/dist.js');

runner.logTotals(true);
