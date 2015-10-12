
load('sugar.js');

load('test/suite/suite.js');
load('test/suite/log.js');
load('test/suite/helpers/common.js');
load('test/suite/helpers/core.js');
load('test/suite/helpers/date.js');

/*
 * 1.7 KNOWN ISSUES:
 *
 * Object(str) produces type "object" but has no defined keys. This breaks a
 * number of tests including Object.isEmpty, Object.size, etc for strings.
 *
 * The function package cannot be used at all as it doesn't have a setTimeout
 * method. A workaround for this can be found here:
 * http://stackoverflow.com/questions/2261705/how-to-run-a-javascript-function-asynchronously-without-using-settimeout
 *
 * However the test suite still cannot be loaded as Rhino shadows the "global"
 * object which causes sinon to break.
 *
 */

load('test/tests/array.js');
load('test/tests/core.js');
load('test/tests/date-range.js');
load('test/tests/date.js');
load('test/tests/enumerable.js');
load('test/tests/equals.js');
// load('test/tests/function.js');
load('test/tests/number-range.js');
load('test/tests/number.js');
load('test/tests/object.js');
load('test/tests/regexp.js');
load('test/tests/string-range.js');
load('test/tests/string.js');

runTests(logResults, false, 'rhino');
