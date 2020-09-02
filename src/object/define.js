import { defineInstance } from '../core/object';
import * as methods from './methods';

defineInstance('every', methods.every);
defineInstance('forEach', methods.forEach);
defineInstance('mapKeys', methods.mapKeys);
defineInstance('mapValues', methods.mapValues);
defineInstance('some', methods.some);
