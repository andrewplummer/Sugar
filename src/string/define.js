import { defineStatic, defineInstance } from '../core/string';
import * as methods from './methods';

defineStatic('range', methods.range);
defineInstance('camelize', methods.camelize);
defineInstance('capitalize', methods.capitalize);
defineInstance('dasherize', methods.dasherize);
defineInstance('pad', methods.pad);
defineInstance('parameterize', methods.parameterize);
defineInstance('spacify', methods.spacify);
defineInstance('titleize', methods.titleize);
defineInstance('truncate', methods.truncate);
defineInstance('truncateOnWord', methods.truncateOnWord);
defineInstance('underscore', methods.underscore);
