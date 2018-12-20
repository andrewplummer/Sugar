import Sugar from '../src';

// Helpers
import './helpers/namespace';
import './helpers/methods';
import './helpers/module';
import './helpers/suite';
import './helpers/intl';

// Tests
import './core';
import './number';
import './modules';
import './extended';
import './chainable';

// Export Sugar to global for tests.
global.Sugar = Sugar;
