
environment = 'node';

var Sugar = require('../../../lib/main');

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
require('../sugar/inflections.js');

equal(Array.prototype.remove, Sugar.Array.prototype.remove, 'Array should have been exported');
equal(String.prototype.chars, Sugar.String.prototype.chars, 'String should have been exported');
equal(Number.prototype.upto, Sugar.Number.prototype.upto, 'Number should have been exported');
equal(RegExp.prototype.getFlags, Sugar.RegExp.prototype.getFlags, 'RegExp should have been exported');
equal(Function.prototype.lazy, Sugar.Function.prototype.lazy, 'Function should have been exported');
equal(Date.prototype.iso, Sugar.Date.prototype.iso, 'Date should have been exported');
equal(Object.merge, Sugar.Object.merge, 'Object should have been exported');

syncTestsFinished();
