import { defineInstance } from '../core/date';
import * as methods from './methods';

defineInstance('isFuture', methods.isFuture);
defineInstance('isPast', methods.isPast);
defineInstance('isValid', methods.isValid);
defineInstance('set', methods.set);

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
