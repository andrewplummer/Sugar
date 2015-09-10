var reload = require('require-reload')(require);

require('../setup');

// Tests
reload('../../tests/string.js');

setSugarGlobal(require( '../../../release/npm/sugar-string/sugar-string'));
runTests(logResults, false, 'node');
