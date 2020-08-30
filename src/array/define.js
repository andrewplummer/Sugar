import { defineInstance } from '../core/array';
import * as methods from './methods';

defineInstance('at', methods.at);
defineInstance('average', methods.average);
defineInstance('count', methods.count);
defineInstance('exclude', methods.exclude);
defineInstance('groupBy', methods.groupBy);
defineInstance('median', methods.median);
defineInstance('remove', methods.remove);
defineInstance('sum', methods.sum);
