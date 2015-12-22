var runner = require('./setup');

runner.exitOnFail(false);

runner.notice('Polyfill Packages');

// Cannot practially run ES5 tests here as resetting
// native methods breaks the node require system.
require('./default/es6.js');

runner.notice('Default Tests');

require('./default/core.js');
require('./default/array.js');
require('./default/object.js');
require('./default/enumerable.js');
require('./default/date.js');
require('./default/function.js');
require('./default/inflections.js');
require('./default/language.js');
require('./default/number.js');
require('./default/range.js');
require('./default/regexp.js');
require('./default/string.js');
require('./default/sugar.js');
require('./default/full.js');

runner.notice('Extended Tests');

require('./extended/array.js');
require('./extended/object.js');
require('./extended/enumerable.js');
require('./extended/date.js');
require('./extended/function.js');
require('./extended/inflections.js');
require('./extended/language.js');
require('./extended/number.js');
require('./extended/range.js');
require('./extended/regexp.js');
require('./extended/string.js');
require('./extended/sugar.js');
require('./extended/full.js');

runner.logTotals(true);
