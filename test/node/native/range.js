var reload = require('require-reload')(require);

require('../setup');

// Tests
reload('../../tests/date_range.js');
reload('../../tests/number_range.js');
reload('../../tests/string_range.js');

setSugarGlobal(require( '../../../release/npm/sugar-range/sugar-range')());
runTests(logResults, true, 'node');
