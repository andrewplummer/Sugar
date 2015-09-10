var reload = require('require-reload')(require);

require('../setup');

// Tests
reload('../../tests/core.js');
reload('../../tests/array.js');
reload('../../tests/date.js');
reload('../../tests/date_da.js');
reload('../../tests/date_de.js');
reload('../../tests/date_es.js');
reload('../../tests/date_fi.js');
reload('../../tests/date_fr.js');
reload('../../tests/date_it.js');
reload('../../tests/date_ja.js');
reload('../../tests/date_ko.js');
reload('../../tests/date_nl.js');
reload('../../tests/date_pt.js');
reload('../../tests/date_ru.js');
reload('../../tests/date_sv.js');
reload('../../tests/date_zh_cn.js');
reload('../../tests/date_zh_tw.js');
reload('../../tests/date_range.js');
reload('../../tests/enumerable.js');
reload('../../tests/equals.js');
reload('../../tests/es5.js');
reload('../../tests/es6.js');
reload('../../tests/function.js');
reload('../../tests/inflections.js');
reload('../../tests/language.js');
reload('../../tests/number.js');
reload('../../tests/number_range.js');
reload('../../tests/object.js');
reload('../../tests/regexp.js');
reload('../../tests/string.js');
reload('../../tests/string_range.js');


setSugarGlobal(require( '../../../release/npm/sugar-full/sugar-full'));
runTests(logResults, false, 'node');
