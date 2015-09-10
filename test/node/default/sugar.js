var reload = require('require-reload')(require);

require('../setup');

// Tests
reload('../../tests/core.js');
reload('../../tests/array.js');
reload('../../tests/date.js');
reload('../../tests/date_range.js');
reload('../../tests/enumerable.js');
reload('../../tests/equals.js');
reload('../../tests/es5.js');
reload('../../tests/es6.js');
reload('../../tests/function.js');
reload('../../tests/number.js');
reload('../../tests/number_range.js');
reload('../../tests/object.js');
reload('../../tests/regexp.js');
reload('../../tests/string.js');
reload('../../tests/string_range.js');

setSugarGlobal(require( '../../../release/npm/sugar/sugar'));
runTests(logResults, false, 'node');
