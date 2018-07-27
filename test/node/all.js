var runner = require('./setup');

runner.notice('Core');
runner.load('./default/sugar-core.js');

runner.notice('Default');
runner.load('./default/dist.js');
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

runner.notice('Chained');
runner.load('./chained/dist.js');
runner.load('./chained/sugar.js');
runner.load('./chained/sugar-array.js');
runner.load('./chained/sugar-object.js');
runner.load('./chained/sugar-enumerable.js');
runner.load('./chained/sugar-date.js');
runner.load('./chained/sugar-function.js');
runner.load('./chained/sugar-inflections.js');
runner.load('./chained/sugar-language.js');
runner.load('./chained/sugar-number.js');
runner.load('./chained/sugar-range.js');
runner.load('./chained/sugar-regexp.js');
runner.load('./chained/sugar-string.js');

runner.notice('Extended');
runner.load('./extended/dist.js');
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
