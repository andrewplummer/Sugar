var reload = require('require-reload')(require);

require('../setup');

// Tests
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


setSugarGlobal(require( '../../../release/npm/sugar-date-locales/sugar-date-locales'));
runTests(logResults, false, 'node');
