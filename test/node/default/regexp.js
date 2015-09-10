var reload = require('require-reload')(require);

require('../setup');

// Tests
reload('../../tests/regexp.js');

setSugarGlobal(require( '../../../release/npm/sugar-regexp/sugar-regexp'));
runTests(logResults, false, 'node');
