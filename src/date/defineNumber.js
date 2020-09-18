import { defineInstance } from '../core/number';
import * as methods from './methods';

defineInstance('second', methods.seconds);
defineInstance('minute', methods.minutes);
defineInstance('hour', methods.hours);
defineInstance('day', methods.days);
defineInstance('week', methods.weeks);
defineInstance('month', methods.months);
defineInstance('year', methods.years);

defineInstance('seconds', methods.seconds);
defineInstance('minutes', methods.minutes);
defineInstance('hours', methods.hours);
defineInstance('days', methods.days);
defineInstance('weeks', methods.weeks);
defineInstance('months', methods.months);
defineInstance('years', methods.years);
