/*
 * RUN THESE TESTS:
 *
 * java -jar /path/to/rhino-1.7.7.1.jar -f test/rhino/sugar.js
 *
 * 1.7 KNOWN ISSUES:
 *
 * Typed Arrays incorrectly skip the 0 index when enumerating with for..in
 * so certain isEqual tests will break here.
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

load('dist/sugar.js');

load('lib/locales/ca.js');
load('lib/locales/da.js');
load('lib/locales/de.js');
load('lib/locales/es.js');
load('lib/locales/fi.js');
load('lib/locales/fr.js');
load('lib/locales/it.js');
load('lib/locales/ja.js');
load('lib/locales/ko.js');
load('lib/locales/nl.js');
load('lib/locales/pl.js');
load('lib/locales/pt.js');
load('lib/locales/ru.js');
load('lib/locales/sv.js');
load('lib/locales/zh-CN.js');
load('lib/locales/zh-TW.js');

load('test/suite/suite.js');
load('test/suite/log.js');
load('test/suite/helpers/core.js');
load('test/suite/helpers/common.js');
load('test/suite/helpers/array.js');
load('test/suite/helpers/date.js');
load('test/suite/helpers/object.js');


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

load('test/tests/range/date.js');
load('test/tests/range/number.js');
load('test/tests/range/string.js');

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

runTests(logResults, 'default', 'rhino');
