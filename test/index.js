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
import './tests/modules/sugar-entry';
import './tests/modules/sugar-namespace-entry';
import './tests/modules/sugar-method-entry';
import './tests/modules/plugin-entry';
import './tests/modules/plugin-method-entry';
import './tests/modules/plugin-method-define';

// Export Sugar to global for tests.
global.Sugar = Sugar;
