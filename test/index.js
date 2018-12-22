import Sugar from '../src';

// Helpers
import './helpers/namespace';
import './helpers/methods';
import './helpers/module';
import './helpers/suite';
import './helpers/intl';

// Tests
import './tests/core';
import './tests/number';
import './tests/extended';
import './tests/chainable';
import './tests/modules/sugar';
import './tests/modules/plugin';
import './tests/modules/plugin-method';
import './tests/modules/plugin-method-define';

// Export Sugar to global for tests.
global.Sugar = Sugar;
