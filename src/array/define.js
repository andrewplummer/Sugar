import { defineInstance } from '../core/array';
import * as methods from './methods';

defineInstance('add', methods.add);
defineInstance('append', methods.append);
defineInstance('at', methods.at);
defineInstance('average', methods.average);
defineInstance('compact', methods.compact);
defineInstance('count', methods.count);
defineInstance('exclude', methods.exclude);
defineInstance('every', methods.every);
defineInstance('filter', methods.filter);
defineInstance('find', methods.find);
defineInstance('findIndex', methods.findIndex);
defineInstance('groupBy', methods.groupBy);
defineInstance('insert', methods.insert);
defineInstance('intersect', methods.intersect);
defineInstance('isEmpty', methods.isEmpty);
defineInstance('map', methods.map);
defineInstance('max', methods.max);
defineInstance('maxAll', methods.maxAll);
defineInstance('min', methods.min);
defineInstance('minAll', methods.minAll);
defineInstance('median', methods.median);
defineInstance('none', methods.none);
defineInstance('remove', methods.remove);
defineInstance('sample', methods.sample);
defineInstance('shuffle', methods.shuffle);
defineInstance('some', methods.some);
defineInstance('sortBy', methods.sortBy);
defineInstance('subtract', methods.subtract);
defineInstance('sum', methods.sum);
defineInstance('union', methods.union);
defineInstance('unique', methods.unique);
defineInstance('zip', methods.zip);
