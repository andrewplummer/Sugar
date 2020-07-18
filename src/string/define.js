import { defineStatic, defineInstance } from '../core/string';
import * as methods from './methods';

defineStatic('range', methods.range);
defineInstance('capitalize', methods.capitalize);
defineInstance('pad', methods.pad);
