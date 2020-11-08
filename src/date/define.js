import { defineStatic, defineInstance } from './namespace';
import * as methods from './methods';

defineStatic('create', methods.create);

defineInstance('advance', methods.advance);
defineInstance('clone', methods.clone);
defineInstance('format', methods.format);
defineInstance('get', methods.get);
defineInstance('getDaysInMonth', methods.getDaysInMonth);
defineInstance('getWeekday', methods.getWeekday);
defineInstance('relative', methods.relative);
defineInstance('rewind', methods.rewind);
defineInstance('set', methods.set);
defineInstance('setDay', methods.setWeekday);
defineInstance('setWeekday', methods.setWeekday);

defineInstance('isToday', methods.isToday);
defineInstance('isYesterday', methods.isYesterday);
defineInstance('isTomorrow', methods.isTomorrow);
defineInstance('isLastWeek', methods.isLastWeek);
defineInstance('isThisWeek', methods.isThisWeek);
defineInstance('isNextWeek', methods.isNextWeek);
defineInstance('isLastMonth', methods.isLastMonth);
defineInstance('isThisMonth', methods.isThisMonth);
defineInstance('isNextMonth', methods.isNextMonth);
defineInstance('isLastYear', methods.isLastYear);
defineInstance('isThisYear', methods.isThisYear);
defineInstance('isNextYear', methods.isNextYear);

defineInstance('is', methods.is);
defineInstance('isAfter', methods.isAfter);
defineInstance('isBefore', methods.isBefore);
defineInstance('isBetween', methods.isBetween);
defineInstance('isFuture', methods.isFuture);
defineInstance('isLeapYear', methods.isLeapYear);
defineInstance('isPast', methods.isPast);
defineInstance('isValid', methods.isValid);
defineInstance('isWeekday', methods.isWeekday);
defineInstance('isWeekend', methods.isWeekend);

defineInstance('getISOWeek', methods.getISOWeek);
defineInstance('setISOWeek', methods.setISOWeek);
defineInstance('startOfISOWeek', methods.startOfISOWeek);
defineInstance('endOfISOWeek', methods.endOfISOWeek);

defineInstance('addYears', methods.addYears);
defineInstance('addMonths', methods.addMonths);
defineInstance('addWeeks', methods.addWeeks);
defineInstance('addDays', methods.addDays);
defineInstance('addHours', methods.addHours);
defineInstance('addMinutes', methods.addMinutes);
defineInstance('addSeconds', methods.addSeconds);
defineInstance('addMilliseconds', methods.addMilliseconds);

defineInstance('yearsAgo', methods.yearsAgo);
defineInstance('monthsAgo', methods.monthsAgo);
defineInstance('weeksAgo', methods.weeksAgo);
defineInstance('daysAgo', methods.daysAgo);
defineInstance('hoursAgo', methods.hoursAgo);
defineInstance('minutesAgo', methods.minutesAgo);
defineInstance('secondsAgo', methods.secondsAgo);
defineInstance('millisecondsAgo', methods.millisecondsAgo);

defineInstance('yearsFromNow', methods.yearsFromNow);
defineInstance('monthsFromNow', methods.monthsFromNow);
defineInstance('weeksFromNow', methods.weeksFromNow);
defineInstance('daysFromNow', methods.daysFromNow);
defineInstance('hoursFromNow', methods.hoursFromNow);
defineInstance('minutesFromNow', methods.minutesFromNow);
defineInstance('secondsFromNow', methods.secondsFromNow);
defineInstance('millisecondsFromNow', methods.millisecondsFromNow);

defineInstance('yearsBefore', methods.yearsBefore);
defineInstance('monthsBefore', methods.monthsBefore);
defineInstance('weeksBefore', methods.weeksBefore);
defineInstance('daysBefore', methods.daysBefore);
defineInstance('hoursBefore', methods.hoursBefore);
defineInstance('minutesBefore', methods.minutesBefore);
defineInstance('secondsBefore', methods.secondsBefore);
defineInstance('millisecondsBefore', methods.millisecondsBefore);

defineInstance('yearsAfter', methods.yearsAfter);
defineInstance('monthsAfter', methods.monthsAfter);
defineInstance('weeksAfter', methods.weeksAfter);
defineInstance('daysAfter', methods.daysAfter);
defineInstance('hoursAfter', methods.hoursAfter);
defineInstance('minutesAfter', methods.minutesAfter);
defineInstance('secondsAfter', methods.secondsAfter);
defineInstance('millisecondsAfter', methods.millisecondsAfter);

defineInstance('startOfYear', methods.startOfYear);
defineInstance('startOfMonth', methods.startOfMonth);
defineInstance('startOfWeek', methods.startOfWeek);
defineInstance('startOfDay', methods.startOfDay);
defineInstance('startOfHour', methods.startOfHour);
defineInstance('startOfMinute', methods.startOfMinute);
defineInstance('startOfSecond', methods.startOfSecond);

defineInstance('endOfYear', methods.endOfYear);
defineInstance('endOfMonth', methods.endOfMonth);
defineInstance('endOfWeek', methods.endOfWeek);
defineInstance('endOfDay', methods.endOfDay);
defineInstance('endOfHour', methods.endOfHour);
defineInstance('endOfMinute', methods.endOfMinute);
defineInstance('endOfSecond', methods.endOfSecond);
