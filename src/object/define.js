import { defineInstance } from '../core/object';
import * as methods from './methods';

defineInstance('every', methods.every);
defineInstance('exclude', methods.exclude);
defineInstance('excludeValues', methods.excludeValues);
defineInstance('filter', methods.filter);
defineInstance('filterValues', methods.filterValues);
defineInstance('findKey', methods.findKey);
defineInstance('forEach', methods.forEach);
defineInstance('mapKeys', methods.mapKeys);
defineInstance('mapValues', methods.mapValues);
defineInstance('remove', methods.remove);
defineInstance('removeValues', methods.removeValues);
defineInstance('some', methods.some);
