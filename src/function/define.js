import { defineInstance } from '../core/function';
import * as methods from './methods';

defineInstance('debounce', methods.debounce);
defineInstance('lock', methods.lock);
defineInstance('memoize', methods.memoize);
defineInstance('once', methods.once);
defineInstance('partial', methods.partial);
defineInstance('setInterval', methods.setInterval);
defineInstance('setTimeout', methods.setTimeout);
defineInstance('throttle', methods.throttle);
