
environment = 'node';

var Sugar = require('../../../release/sugar-full.development');

// Test suite
require('../../javascripts/setup.js');
require('../../javascripts/date_helper.js');
require('../../javascripts/object_helper.js');

// Tests
require('../sugar/object.js');
require('../sugar/string.js');
require('../sugar/array.js');
require('../sugar/number.js');
require('../sugar/date.js');
require('../sugar/regexp.js');
require('../sugar/function.js');
require('../sugar/es5.js');
require('../sugar/equals.js');
require('../sugar/date_zh_cn.js')
require('../sugar/date_zh_tw.js')
require('../sugar/date_ko.js')
require('../sugar/date_ru.js')
require('../sugar/date_es.js')
require('../sugar/date_pt.js')
require('../sugar/date_fr.js')
require('../sugar/date_it.js')
require('../sugar/date_de.js')
require('../sugar/date_ja.js')
require('../sugar/date_sv.js')
require('../sugar/date_range.js');
require('../sugar/inflections.js');
require('../sugar/language.js');

syncTestsFinished();
