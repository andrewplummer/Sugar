var runner = require('../setup');

// Tests
runner.loadTest('core');
runner.loadTest('array');
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
runner.loadTest('date-range');
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

runner.run(module);
