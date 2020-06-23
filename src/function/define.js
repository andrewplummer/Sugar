import { defineInstance } from '../core/function';
import * as methods from './methods';

defineInstance('memoize', methods.memoize);
defineInstance('throttle', methods.throttle);
defineInstance('debounce', methods.debounce);
