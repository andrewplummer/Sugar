import { defineInstance } from '../core/object';
import * as methods from './methods';

defineInstance('forEach', methods.forEach);
defineInstance('mapKeys', methods.mapKeys);
defineInstance('mapValues', methods.mapValues);
