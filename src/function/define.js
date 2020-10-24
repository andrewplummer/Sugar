import { defineInstance } from './namespace';
import * as methods from './methods';

defineInstance('callAfter', methods.callAfter);
defineInstance('callUntil', methods.callUntil);
defineInstance('debounce', methods.debounce);
defineInstance('lock', methods.lock);
defineInstance('filter', methods.filter);
defineInstance('memoize', methods.memoize);
defineInstance('once', methods.once);
defineInstance('partial', methods.partial);
defineInstance('setInterval', methods.setInterval);
defineInstance('setTimeout', methods.setTimeout);
defineInstance('throttle', methods.throttle);
