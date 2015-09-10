var reload = require('require-reload')(require);

require('../setup');

// Tests
reload('../../tests/equals.js');
reload('../../tests/object.js');

setSugarGlobal(require( '../../../release/npm/sugar-object/sugar-object')());
runTests(logResults, true, 'node');
