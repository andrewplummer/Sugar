var runner = require('../setup');
runner.exitOnFail(false);

require('./array.js');
require('./core.js');
require('./date.js');
require('./date-locales.js');
require('./function.js');
require('./inflections.js');
require('./language.js');
require('./number.js');
require('./object.js');
require('./range.js');
require('./regexp.js');
require('./string.js');
require('./sugar.js');
require('./full.js');

runner.logTotals();
