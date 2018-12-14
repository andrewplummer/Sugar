import Sugar from '../src';

// Helpers
import './helpers/suite';
import './helpers/module';
import './helpers/methods';
import './helpers/namespace';

// Tests
import './core';
import './number';
import './modules';
import './extended';
import './chainable';

// Export Sugar to global for tests.
global.Sugar = Sugar;
