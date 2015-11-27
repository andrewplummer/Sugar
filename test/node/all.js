var runner = require('./setup');

runner.exitOnFail(false);

runner.notice('Extended Tests');

require('./extended/sugar.js');
require('./extended/full.js');

runner.logTotals(true);
