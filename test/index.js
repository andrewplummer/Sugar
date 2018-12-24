import Sugar from '../src/all';

// TODO: test browserify
// TODO: test broccoli
// TODO: test rhino
// TODO: test QML

// Export Sugar to global for tests.
global.Sugar = Sugar;

// Helpers
import './helpers/namespace';
import './helpers/methods';
import './helpers/suite';
import './helpers/intl';

// Tests
import './tests/core';
import './tests/number';
import './tests/string';
import './tests/regexp';
import './tests/extended';
import './tests/chainable';
import './tests/modules';
