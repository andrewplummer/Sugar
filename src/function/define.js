import { defineInstance } from '../core/function';
import * as methods from './methods';

defineInstance('debounce', methods.debounce);
defineInstance('delay', methods.delay);
defineInstance('memoize', methods.memoize);
defineInstance('once', methods.once);
defineInstance('throttle', methods.throttle);
