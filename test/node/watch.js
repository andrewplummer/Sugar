var runner = require('./setup');
var reload = require('require-reload')(require);

runner.reset();
runner.exitOnFail(false);

runner.notice('Default Tests');

reload('./default/array.js');
reload('./default/core.js');
reload('./default/date.js');
reload('./default/date-locales.js');
reload('./default/function.js');
reload('./default/inflections.js');
reload('./default/language.js');
reload('./default/number.js');
reload('./default/object.js');
reload('./default/range.js');
reload('./default/regexp.js');
reload('./default/string.js');
reload('./default/sugar.js');
reload('./default/full.js');

runner.notice('Native Tests');

reload('./native/array.js');
reload('./native/date.js');
reload('./native/date-locales.js');
reload('./native/function.js');
reload('./native/inflections.js');
reload('./native/language.js');
reload('./native/number.js');
reload('./native/object.js');
reload('./native/range.js');
reload('./native/regexp.js');
reload('./native/string.js');
reload('./native/sugar.js');
reload('./native/full.js');

runner.logTotals();
