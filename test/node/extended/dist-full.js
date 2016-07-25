var runner = require('../setup');

runner.load('../../sugar-full');

// Tests
runner.loadTest('array');
runner.loadTest('date');
runner.loadTest('date-range');
runner.loadTest('locales/da');
runner.loadTest('locales/de');
runner.loadTest('locales/es');
runner.loadTest('locales/fi');
runner.loadTest('locales/fr');
runner.loadTest('locales/it');
runner.loadTest('locales/ja');
runner.loadTest('locales/ko');
runner.loadTest('locales/nl');
runner.loadTest('locales/pt');
runner.loadTest('locales/ru');
runner.loadTest('locales/sv');
runner.loadTest('locales/zh-CN');
runner.loadTest('locales/zh-TW');
runner.loadTest('enumerable');
runner.loadTest('equals');
runner.loadTest('es5');
runner.loadTest('es6');
runner.loadTest('function');
runner.loadTest('inflections');
runner.loadTest('language');
runner.loadTest('number');
runner.loadTest('number-range');
runner.loadTest('object');
runner.loadTest('regexp');
runner.loadTest('string');
runner.loadTest('string-range');

runner.run(module, 'extended');
