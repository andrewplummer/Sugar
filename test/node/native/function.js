var reload = require('require-reload')(require);

require('../setup');

// Tests
reload('../../tests/function.js');

setSugarGlobal(require( '../../../release/npm/sugar-function/sugar-function')());
runTests(logResults, true, 'node');
