import { defineStatic, defineInstance } from '../core/string';
import * as methods from './methods';

defineStatic('range', methods.range);
defineInstance('at', methods.at);
defineInstance('camelize', methods.camelize);
defineInstance('capitalize', methods.capitalize);
defineInstance('dasherize', methods.dasherize);
defineInstance('first', methods.first);
defineInstance('from', methods.from);
defineInstance('last', methods.last);
defineInstance('pad', methods.pad);
defineInstance('parameterize', methods.parameterize);
defineInstance('spacify', methods.spacify);
defineInstance('titleize', methods.titleize);
defineInstance('to', methods.to);
defineInstance('truncate', methods.truncate);
defineInstance('truncateOnWord', methods.truncateOnWord);
defineInstance('underscore', methods.underscore);
