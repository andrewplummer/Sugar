var runner = require('../setup');

runner.load('../../release/npm/sugar');

runner.load('../../release/npm/sugar/locales/ca.js');
runner.load('../../release/npm/sugar/locales/da.js');
runner.load('../../release/npm/sugar/locales/de.js');
runner.load('../../release/npm/sugar/locales/es.js');
runner.load('../../release/npm/sugar/locales/fi.js');
runner.load('../../release/npm/sugar/locales/fr.js');
runner.load('../../release/npm/sugar/locales/it.js');
runner.load('../../release/npm/sugar/locales/ja.js');
runner.load('../../release/npm/sugar/locales/ko.js');
runner.load('../../release/npm/sugar/locales/nl.js');
runner.load('../../release/npm/sugar/locales/pl.js');
runner.load('../../release/npm/sugar/locales/pt.js');
runner.load('../../release/npm/sugar/locales/ru.js');
runner.load('../../release/npm/sugar/locales/sv.js');
runner.load('../../release/npm/sugar/locales/zh-CN.js');
runner.load('../../release/npm/sugar/locales/zh-TW.js');

// Tests
runner.loadTest('core');
runner.loadTest('array');
runner.loadTest('date');
runner.loadTest('equals');
runner.loadTest('function');
runner.loadTest('number');
runner.loadTest('object');
runner.loadTest('regexp');
runner.loadTest('string');
runner.loadTest('enumerable');
runner.loadTest('inflections');
runner.loadTest('language');

runner.loadTest('number-range');
runner.loadTest('string-range');
runner.loadTest('date-range');

runner.loadTest('locales/ca.js');
runner.loadTest('locales/da.js');
runner.loadTest('locales/de.js');
runner.loadTest('locales/es.js');
runner.loadTest('locales/fi.js');
runner.loadTest('locales/fr.js');
runner.loadTest('locales/it.js');
runner.loadTest('locales/ja.js');
runner.loadTest('locales/ko.js');
runner.loadTest('locales/nl.js');
runner.loadTest('locales/pl.js');
runner.loadTest('locales/pt.js');
runner.loadTest('locales/ru.js');
runner.loadTest('locales/sv.js');
runner.loadTest('locales/zh-CN.js');
runner.loadTest('locales/zh-TW.js');

runner.run(module);
