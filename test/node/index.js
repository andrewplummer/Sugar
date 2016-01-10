var runner = require('./setup');

runner.exitOnFail(false);

runner.notice('Polyfill Packages');

// Cannot practially run ES5 tests here as resetting
// native methods breaks the node require system.
runner.load('./default/es6.js');
runner.load('./default/es7.js');

runner.notice('Default Tests');

runner.load('./default/core.js');
runner.load('./default/array.js');
runner.load('./default/object.js');
runner.load('./default/enumerable.js');
runner.load('./default/date.js');
runner.load('./default/function.js');
runner.load('./default/inflections.js');
runner.load('./default/language.js');
runner.load('./default/number.js');
runner.load('./default/range.js');
runner.load('./default/regexp.js');
runner.load('./default/string.js');
runner.load('./default/sugar.js');
runner.load('./default/full.js');

runner.notice('Extended Tests');

runner.load('./extended/array.js');
runner.load('./extended/object.js');
runner.load('./extended/enumerable.js');
runner.load('./extended/date.js');
runner.load('./extended/function.js');
runner.load('./extended/inflections.js');
runner.load('./extended/language.js');
runner.load('./extended/number.js');
runner.load('./extended/range.js');
runner.load('./extended/regexp.js');
runner.load('./extended/string.js');
runner.load('./extended/sugar.js');
runner.load('./extended/full.js');

runner.logTotals();
