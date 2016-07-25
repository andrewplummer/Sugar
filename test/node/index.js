var runner = require('./setup');

runner.notice('Full Extended');
runner.load('./extended/dist-full.js');

runner.logTotals();
