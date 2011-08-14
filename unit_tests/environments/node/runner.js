
environment = 'node';

require(process.env.SUGAR || '../../../lib/sugar.js');

// Test suite
require('../../javascripts/setup.js');
require('../../javascripts/date_helper.js');
require('../../javascripts/object_helper.js');

// Tests
require('../sugar/array.js');
require('../sugar/number.js');
require('../sugar/string.js');
require('../sugar/date.js');
require('../sugar/object.js');
require('../sugar/regexp.js');
require('../sugar/function.js');
require('../sugar/es5.js');

syncTestsFinished();
