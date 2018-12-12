import Sugar from '../src';

// Export Sugar to global for tests.
global.Sugar = Sugar;

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
