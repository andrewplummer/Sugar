var reload = require('require-reload')(require);

require('../setup');

// Tests
reload('../../tests/inflections.js');

setSugarGlobal(require( '../../../release/npm/sugar-inflections/sugar-inflections'));
runTests(logResults, false, 'node');
