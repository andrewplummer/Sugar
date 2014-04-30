
environment = 'node';

// Test suite
require('../../javascripts/suite.js');
require('../../javascripts/helpers.js');
require('../../javascripts/date-helpers.js');

// No conflict tests
require('./no-conflict.js');

var Sugar = require( '../../../release/sugar-full.dev');

// Adding a reference here to the global context
// will save massive amounts of pain later when
// trying to interact with the testing suite, so
// do this for now.
global.Sugar = Sugar;

// Tests
require('../sugar/object.js');
require('../sugar/string.js');
require('../sugar/string_range.js');
require('../sugar/array.js');
require('../sugar/enumerable.js');
require('../sugar/equals.js');
require('../sugar/number.js');
require('../sugar/number_range.js');
require('../sugar/regexp.js');
require('../sugar/function.js');
require('../sugar/global.js');
require('../sugar/es5.js');
require('../sugar/es6.js');
require('../sugar/date.js');
require('../sugar/date_range.js');
require('../sugar/date_de.js')
require('../sugar/date_es.js')
require('../sugar/date_fr.js')
require('../sugar/date_it.js')
require('../sugar/date_ja.js')
require('../sugar/date_ko.js')
require('../sugar/date_nl.js')
require('../sugar/date_pt.js')
require('../sugar/date_ru.js')
require('../sugar/date_sv.js')
require('../sugar/date_zh_cn.js')
require('../sugar/date_zh_tw.js')
require('../sugar/inflections.js');
require('../sugar/language.js');

syncTestsFinished();
