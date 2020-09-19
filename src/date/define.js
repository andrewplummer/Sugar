import { defineInstance } from '../core/date';
import * as methods from './methods';

defineInstance('advance', methods.advance);
defineInstance('getISOWeek', methods.getISOWeek);
defineInstance('getWeekday', methods.getWeekday);
defineInstance('isFuture', methods.isFuture);
defineInstance('isPast', methods.isPast);
defineInstance('isValid', methods.isValid);
defineInstance('rewind', methods.rewind);
defineInstance('set', methods.set);
defineInstance('setDay', methods.setWeekday);
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
