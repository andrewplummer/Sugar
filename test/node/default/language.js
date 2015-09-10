var reload = require('require-reload')(require);

require('../setup');

// Tests
reload('../../tests/language.js');

setSugarGlobal(require( '../../../release/npm/sugar-language/sugar-language'));
runTests(logResults, false, 'node');
