var runner = require('../setup');

// Tests
runner.loadTest('core');
runner.loadTest('array');
runner.loadTest('date');
runner.loadTest('date_da');
runner.loadTest('date_de');
runner.loadTest('date_es');
runner.loadTest('date_fi');
runner.loadTest('date_fr');
runner.loadTest('date_it');
runner.loadTest('date_ja');
runner.loadTest('date_ko');
runner.loadTest('date_nl');
runner.loadTest('date_pt');
runner.loadTest('date_ru');
runner.loadTest('date_sv');
runner.loadTest('date_zh_cn');
runner.loadTest('date_zh_tw');
runner.loadTest('date_range');
runner.loadTest('enumerable');
runner.loadTest('equals');
runner.loadTest('es5');
runner.loadTest('es6');
runner.loadTest('function');
runner.loadTest('inflections');
runner.loadTest('language');
runner.loadTest('number');
runner.loadTest('number_range');
runner.loadTest('object');
runner.loadTest('regexp');
runner.loadTest('string');
runner.loadTest('string_range');

runner.run(module);
