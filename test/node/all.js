var runner = require('./setup');

runner.exitOnFail(false);

runner.notice('Default Tests');

require('./default/array.js');
require('./default/core.js');
require('./default/date.js');
require('./default/date-locales.js');
require('./default/function.js');
require('./default/inflections.js');
require('./default/language.js');
require('./default/number.js');
require('./default/object.js');
require('./default/range.js');
require('./default/regexp.js');
require('./default/string.js');
require('./default/sugar.js');
require('./default/full.js');

runner.notice('Native Tests');

require('./native/array.js');
require('./native/date.js');
require('./native/date-locales.js');
require('./native/function.js');
require('./native/inflections.js');
require('./native/language.js');
require('./native/number.js');
require('./native/object.js');
require('./native/range.js');
require('./native/regexp.js');
require('./native/string.js');
require('./native/sugar.js');
require('./native/full.js');

runner.logTotals(true);
