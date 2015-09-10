var reload = require('require-reload')(require);

require('../setup');

// Tests
reload('../../tests/core.js');

setSugarGlobal(require( '../../../release/npm/sugar-core/sugar-core'));
runTests(logResults, false, 'node');
