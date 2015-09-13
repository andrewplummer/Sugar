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

runner.notice('Extended Tests');

reload('./extended/array.js');
reload('./extended/date.js');
reload('./extended/date-locales.js');
reload('./extended/function.js');
reload('./extended/inflections.js');
reload('./extended/language.js');
reload('./extended/number.js');
reload('./extended/object.js');
reload('./extended/range.js');
reload('./extended/regexp.js');
reload('./extended/string.js');
reload('./extended/sugar.js');
reload('./extended/full.js');

runner.logTotals();
