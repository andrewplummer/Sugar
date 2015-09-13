var runner = require('../setup');

// Tests
runner.loadTest('date');
runner.loadTest('date-da');
runner.loadTest('date-de');
runner.loadTest('date-es');
runner.loadTest('date-fi');
runner.loadTest('date-fr');
runner.loadTest('date-it');
runner.loadTest('date-ja');
runner.loadTest('date-ko');
runner.loadTest('date-nl');
runner.loadTest('date-pt');
runner.loadTest('date-ru');
runner.loadTest('date-sv');
runner.loadTest('date-zh_cn');
runner.loadTest('date-zh_tw');

runner.runExtended(module);
