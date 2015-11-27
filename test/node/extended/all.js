var runner = require('../setup');
runner.exitOnFail(false);

require('./sugar.js');
require('./full.js');

runner.logTotals();
