var runner = require('./setup');

runner.notice('Core');
runner.load('./default/sugar-core.js');

runner.notice('Polyfills');
// Cannot practially run ES5 tests here as resetting
// native methods breaks the node require system.
runner.load('./default/sugar-es6.js');
runner.load('./default/sugar-es7.js');

runner.notice('Default');
runner.load('./default/default.js');
runner.load('./default/sugar.js');
runner.load('./default/sugar-array.js');
runner.load('./default/sugar-object.js');
runner.load('./default/sugar-enumerable.js');
runner.load('./default/sugar-date.js');
runner.load('./default/sugar-function.js');
runner.load('./default/sugar-inflections.js');
runner.load('./default/sugar-language.js');
runner.load('./default/sugar-number.js');
runner.load('./default/sugar-range.js');
runner.load('./default/sugar-regexp.js');
runner.load('./default/sugar-string.js');

runner.notice('Extended');
runner.load('./extended/default.js');
runner.load('./extended/sugar.js');
runner.load('./extended/sugar-array.js');
runner.load('./extended/sugar-object.js');
runner.load('./extended/sugar-enumerable.js');
runner.load('./extended/sugar-date.js');
runner.load('./extended/sugar-function.js');
runner.load('./extended/sugar-inflections.js');
runner.load('./extended/sugar-language.js');
runner.load('./extended/sugar-number.js');
runner.load('./extended/sugar-range.js');
runner.load('./extended/sugar-regexp.js');
runner.load('./extended/sugar-string.js');

runner.logTotals();
