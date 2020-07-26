import { defineInstance } from '../core/function';
import * as methods from './methods';

defineInstance('debounce', methods.debounce);
defineInstance('memoize', methods.memoize);
defineInstance('once', methods.once);
defineInstance('setInterval', methods.setInterval);
defineInstance('setTimeout', methods.setTimeout);
defineInstance('throttle', methods.throttle);
