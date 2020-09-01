// Note: cannot use modules here as Sinon needs to apply fake timers
// before Sugar is imported to correctly mock setTimeout.

const Sinon = require('sinon');
global.clock = Sinon.useFakeTimers();

const { Sugar } = require('../src');

// TODO: test browserify
// TODO: test broccoli
// TODO: test rhino
// TODO: test QML

// Export Sugar to global for tests.
global.Sugar = Sugar;

// Helpers
require('./helpers/namespace');
require('./helpers/suite');
require('./helpers/util');
require('./helpers/intl');

// Tests
require('./tests/core');
require('./tests/chainable');
require('./tests/extended');
require('./tests/array');
require('./tests/number');
require('./tests/object');
require('./tests/string');
require('./tests/regexp');
require('./tests/function');
require('./tests/modules');
