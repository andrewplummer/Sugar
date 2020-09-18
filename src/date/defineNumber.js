import { defineInstance } from '../core/number';
import * as methods from './methods';

defineInstance('second', methods.seconds);
defineInstance('minute', methods.minutes);
defineInstance('hour', methods.hours);
defineInstance('day', methods.days);
defineInstance('week', methods.weeks);
defineInstance('month', methods.months);
defineInstance('year', methods.years);

defineInstance('years', methods.years);
defineInstance('months', methods.months);
defineInstance('weeks', methods.weeks);
defineInstance('days', methods.days);
defineInstance('hours', methods.hours);
defineInstance('minutes', methods.minutes);
defineInstance('seconds', methods.seconds);

defineInstance('yearAgo', methods.yearsAgo);
defineInstance('monthAgo', methods.monthsAgo);
defineInstance('weekAgo', methods.weeksAgo);
defineInstance('dayAgo', methods.daysAgo);
defineInstance('hourAgo', methods.hoursAgo);
defineInstance('minuteAgo', methods.minutesAgo);
defineInstance('secondAgo', methods.secondsAgo);
defineInstance('millisecondAgo', methods.millisecondsAgo);

defineInstance('yearsAgo', methods.yearsAgo);
defineInstance('monthsAgo', methods.monthsAgo);
defineInstance('weeksAgo', methods.weeksAgo);
defineInstance('daysAgo', methods.daysAgo);
defineInstance('hoursAgo', methods.hoursAgo);
defineInstance('minutesAgo', methods.minutesAgo);
defineInstance('secondsAgo', methods.secondsAgo);
defineInstance('millisecondsAgo', methods.millisecondsAgo);

defineInstance('yearFromNow', methods.yearsFromNow);
defineInstance('monthFromNow', methods.monthsFromNow);
defineInstance('weekFromNow', methods.weeksFromNow);
defineInstance('dayFromNow', methods.daysFromNow);
defineInstance('hourFromNow', methods.hoursFromNow);
defineInstance('minuteFromNow', methods.minutesFromNow);
defineInstance('secondFromNow', methods.secondsFromNow);
defineInstance('millisecondFromNow', methods.millisecondsFromNow);

defineInstance('yearsFromNow', methods.yearsFromNow);
defineInstance('monthsFromNow', methods.monthsFromNow);
defineInstance('weeksFromNow', methods.weeksFromNow);
defineInstance('daysFromNow', methods.daysFromNow);
defineInstance('hoursFromNow', methods.hoursFromNow);
defineInstance('minutesFromNow', methods.minutesFromNow);
defineInstance('secondsFromNow', methods.secondsFromNow);
defineInstance('millisecondsFromNow', methods.millisecondsFromNow);
