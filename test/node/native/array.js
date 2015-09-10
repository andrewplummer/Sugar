var reload = require('require-reload')(require);

require('../setup');

// Tests
reload('../../tests/es5.js');
reload('../../tests/array.js');
reload('../../tests/enumerable.js');

setSugarGlobal(require( '../../../release/npm/sugar-array/sugar-array')());
runTests(logResults, true, 'node');
