var runner = require('../setup');

// Tests
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

runner.runExtended(module);
