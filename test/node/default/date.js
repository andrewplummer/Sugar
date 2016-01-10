var runner = require('../setup');

runner.load('../../release/npm/sugar-date');

runner.load('../../release/npm/sugar-date/locales/ca.js');
runner.load('../../release/npm/sugar-date/locales/da.js');
runner.load('../../release/npm/sugar-date/locales/de.js');
runner.load('../../release/npm/sugar-date/locales/es.js');
runner.load('../../release/npm/sugar-date/locales/fi.js');
runner.load('../../release/npm/sugar-date/locales/fr.js');
runner.load('../../release/npm/sugar-date/locales/it.js');
runner.load('../../release/npm/sugar-date/locales/ja.js');
runner.load('../../release/npm/sugar-date/locales/ko.js');
runner.load('../../release/npm/sugar-date/locales/nl.js');
runner.load('../../release/npm/sugar-date/locales/pl.js');
runner.load('../../release/npm/sugar-date/locales/pt.js');
runner.load('../../release/npm/sugar-date/locales/ru.js');
runner.load('../../release/npm/sugar-date/locales/sv.js');
runner.load('../../release/npm/sugar-date/locales/zh-CN.js');
runner.load('../../release/npm/sugar-date/locales/zh-TW.js');

// Tests
runner.loadTest('date');

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
