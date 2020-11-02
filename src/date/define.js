import { defineStatic, defineInstance } from './namespace';
import * as methods from './methods';

defineStatic('create', methods.create);

defineInstance('advance', methods.advance);
defineInstance('clone', methods.clone);
defineInstance('format', methods.format);
defineInstance('getDaysInMonth', methods.getDaysInMonth);
defineInstance('getISOWeek', methods.getISOWeek);
defineInstance('getWeekday', methods.getWeekday);
defineInstance('isFuture', methods.isFuture);
defineInstance('isLeapYear', methods.isLeapYear);
defineInstance('isPast', methods.isPast);
defineInstance('isValid', methods.isValid);
defineInstance('isWeekday', methods.isWeekday);
defineInstance('isWeekend', methods.isWeekend);
defineInstance('relative', methods.relative);
defineInstance('rewind', methods.rewind);
defineInstance('set', methods.set);
defineInstance('setDay', methods.setWeekday);
defineInstance('setISOWeek', methods.setISOWeek);
defineInstance('setWeekday', methods.setWeekday);

defineInstance('addYears', methods.addYears);
defineInstance('addMonths', methods.addMonths);
defineInstance('addWeeks', methods.addWeeks);
defineInstance('addDays', methods.addDays);
defineInstance('addHours', methods.addHours);
defineInstance('addMinutes', methods.addMinutes);
defineInstance('addSeconds', methods.addSeconds);
defineInstance('addMilliseconds', methods.addMilliseconds);

defineInstance('isSunday', methods.isSunday);
defineInstance('isMonday', methods.isMonday);
defineInstance('isTuesday', methods.isTuesday);
defineInstance('isWednesday', methods.isWednesday);
defineInstance('isThursday', methods.isThursday);
defineInstance('isFriday', methods.isFriday);
defineInstance('isSaturday', methods.isSaturday);

defineInstance('isJanuary', methods.isJanuary);
defineInstance('isFebruary', methods.isFebruary);
defineInstance('isMarch', methods.isMarch);
defineInstance('isApril', methods.isApril);
defineInstance('isMay', methods.isMay);
defineInstance('isJune', methods.isJune);
defineInstance('isJuly', methods.isJuly);
defineInstance('isAugust', methods.isAugust);
defineInstance('isSeptember', methods.isSeptember);
defineInstance('isOctober', methods.isOctober);
defineInstance('isNovember', methods.isNovember);
defineInstance('isDecember', methods.isDecember);

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

defineInstance('startOfYear', methods.startOfYear);
defineInstance('startOfMonth', methods.startOfMonth);
defineInstance('startOfWeek', methods.startOfWeek);
defineInstance('startOfISOWeek', methods.startOfISOWeek);
defineInstance('startOfDay', methods.startOfDay);
defineInstance('startOfHour', methods.startOfHour);
defineInstance('startOfMinute', methods.startOfMinute);
defineInstance('startOfSecond', methods.startOfSecond);

defineInstance('endOfYear', methods.endOfYear);
defineInstance('endOfMonth', methods.endOfMonth);
defineInstance('endOfWeek', methods.endOfWeek);
defineInstance('endOfISOWeek', methods.endOfISOWeek);
defineInstance('endOfDay', methods.endOfDay);
defineInstance('endOfHour', methods.endOfHour);
defineInstance('endOfMinute', methods.endOfMinute);
defineInstance('endOfSecond', methods.endOfSecond);
