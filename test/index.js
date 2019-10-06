import { Sugar } from '../src';
import Sinon from 'sinon';

global.clock = Sinon.useFakeTimers();

// TODO: test browserify
// TODO: test broccoli
// TODO: test rhino
// TODO: test QML

// Export Sugar to global for tests.
global.Sugar = Sugar;

// Helpers
import './helpers/namespace';
import './helpers/suite';
import './helpers/util';
import './helpers/intl';

// Tests
import './tests/core';
import './tests/chainable';
import './tests/extended';
import './tests/number';
import './tests/string';
import './tests/regexp';
import './tests/function';
import './tests/modules';
