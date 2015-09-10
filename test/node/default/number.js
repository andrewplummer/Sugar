var reload = require('require-reload')(require);

require('../setup');

// Tests
reload('../../tests/number.js');

setSugarGlobal(require( '../../../release/npm/sugar-number/sugar-number'));
runTests(logResults, false, 'node');
