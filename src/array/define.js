import { defineInstance } from '../core/array';
import * as methods from './methods';

defineInstance('at', methods.at);
defineInstance('exclude', methods.exclude);
defineInstance('groupBy', methods.groupBy);
defineInstance('remove', methods.remove);
