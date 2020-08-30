import { defineInstance } from '../core/array';
import * as methods from './methods';

defineInstance('at', methods.at);
defineInstance('average', methods.average);
defineInstance('count', methods.count);
defineInstance('exclude', methods.exclude);
defineInstance('every', methods.every);
defineInstance('groupBy', methods.groupBy);
defineInstance('median', methods.median);
defineInstance('none', methods.none);
defineInstance('remove', methods.remove);
defineInstance('some', methods.some);
defineInstance('sum', methods.sum);
