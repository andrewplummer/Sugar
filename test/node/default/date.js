var reload = require('require-reload')(require);

require('../setup');

// Tests
reload('../../tests/date.js');

setSugarGlobal(require( '../../../release/npm/sugar-date/sugar-date'));
runTests(logResults, false, 'node');
