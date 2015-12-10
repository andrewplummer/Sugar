var runner = require('../setup');

runner.loadPackage('../../release/npm/sugar/date');
runner.loadPackage('../../release/npm/sugar/range');



// Tests
runner.loadTest('date');
runner.loadTest('date-range');

//runner.loadTest('locales/ca.js');
//runner.loadTest('locales/da.js');
//runner.loadTest('locales/de.js');
//runner.loadTest('locales/es.js');
//runner.loadTest('locales/fi.js');
//runner.loadTest('locales/fr.js');
//runner.loadTest('locales/it.js');
//runner.loadTest('locales/ja.js');
//runner.loadTest('locales/ko.js');
//runner.loadTest('locales/nl.js');
//runner.loadTest('locales/pl.js');
//runner.loadTest('locales/pt.js');
//runner.loadTest('locales/ru.js');
//runner.loadTest('locales/sv.js');
//runner.loadTest('locales/zh-CN.js');
//runner.loadTest('locales/zh-TW.js');

runner.run(module);
