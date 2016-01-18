
load('sugar.js');

load('locales/ca.js');
load('locales/da.js');
load('locales/de.js');
load('locales/es.js');
load('locales/fi.js');
load('locales/fr.js');
load('locales/it.js');
load('locales/ja.js');
load('locales/ko.js');
load('locales/nl.js');
load('locales/pl.js');
load('locales/pt.js');
load('locales/ru.js');
load('locales/sv.js');
load('locales/zh-CN.js');
load('locales/zh-TW.js');

load('test/suite/suite.js');
load('test/suite/log.js');
load('test/suite/helpers/core.js');
load('test/suite/helpers/common.js');
load('test/suite/helpers/array.js');
load('test/suite/helpers/date.js');
load('test/suite/helpers/object.js');

/*
 * 1.7 KNOWN ISSUES:
 *
 * Object(str) produces type "object" but has no defined keys. This breaks a
 * number of tests including Object.isEmpty, Object.size, etc for strings.
 *
 * Additionally Rhino appears to allow overwriting non-writable attributes, so
 * tests that assert on those errors will fail.
 *
 * The function module cannot be used at all as it doesn't have a setTimeout
 * method. A workaround for this can be found here:
 * http://stackoverflow.com/questions/2261705/how-to-run-a-javascript-function-asynchronously-without-using-settimeout
 *
 * However the test suite still cannot be loaded as Rhino shadows the "global"
 * object which causes sinon to break.
 *
 */

load('test/tests/core.js');
load('test/tests/array.js');
load('test/tests/date.js');
load('test/tests/equals.js');
// load('test/tests/function.js');
load('test/tests/number.js');
load('test/tests/object.js');
load('test/tests/regexp.js');
load('test/tests/string.js');
load('test/tests/enumerable.js');

load('test/tests/number-range.js');
load('test/tests/string-range.js');
load('test/tests/date-range.js');

load('test/tests/locales/ca.js');
load('test/tests/locales/da.js');
load('test/tests/locales/de.js');
load('test/tests/locales/es.js');
load('test/tests/locales/fi.js');
load('test/tests/locales/fr.js');
load('test/tests/locales/it.js');
load('test/tests/locales/ja.js');
load('test/tests/locales/ko.js');
load('test/tests/locales/nl.js');
load('test/tests/locales/pl.js');
load('test/tests/locales/pt.js');
load('test/tests/locales/ru.js');
load('test/tests/locales/sv.js');
load('test/tests/locales/zh-CN.js');
load('test/tests/locales/zh-TW.js');

runTests(logResults, false, 'rhino');
