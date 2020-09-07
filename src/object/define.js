import { defineInstance } from '../core/object';
import * as methods from './methods';

defineInstance('average', methods.average);
defineInstance('count', methods.count);
defineInstance('every', methods.every);
defineInstance('findKey', methods.findKey);
defineInstance('forEach', methods.forEach);
defineInstance('isEmpty', methods.isEmpty);
defineInstance('isEqual', methods.isEqual);
defineInstance('mapKeys', methods.mapKeys);
defineInstance('mapValues', methods.mapValues);
defineInstance('median', methods.median);
defineInstance('maxKey', methods.maxKey);
defineInstance('maxKeys', methods.maxKeys);
defineInstance('minKey', methods.minKey);
defineInstance('minKeys', methods.minKeys);
defineInstance('none', methods.none);
defineInstance('reduce', methods.reduce);
defineInstance('reject', methods.reject);
defineInstance('rejectKeys', methods.rejectKeys);
defineInstance('rejectValues', methods.rejectValues);
defineInstance('remove', methods.remove);
defineInstance('removeKeys', methods.removeKeys);
defineInstance('removeValues', methods.removeValues);
defineInstance('select', methods.select);
defineInstance('selectKeys', methods.selectKeys);
defineInstance('selectValues', methods.selectValues);
defineInstance('size', methods.size);
defineInstance('some', methods.some);
defineInstance('sum', methods.sum);
