import { assertInteger } from '../../util/assertions';
import { isDate } from '../../util/typeChecks';
import { setWeekday } from './weekdays';

const METHOD_NAMES = {
  year: 'FullYear',
  month: 'Month',
  date: 'Date',
  day: 'Day',
  hour: 'Hours',
  minute: 'Minutes',
  second: 'Seconds',
  millisecond: 'Milliseconds',
};

export function callDateGet(date, unit) {
  return date[`get${getMethodUnit(unit)}`]();
}

export function callDateSet(date, unit, val) {
  assertInteger(val);

  if (unit === 'day') {
    // "setDay" does not exist, so set by date offset and return.
    setWeekday(date, val);
    return;
  } else if (unit === 'month') {
    // If intentionally setting the date to a specific month, prevent traversing
    // into a new month when not enough days are available. Do this by setting
    // the minimum value between the current date and the number of days in the
    // target month.
    preventMonthTraversal(date, val);
  }

  date[`set${getMethodUnit(unit)}`](val);
}

export function getDaysInMonth(...args) {
  const [year, month] = collectYearMonth(args);
  return 32 - new Date(year, month, 32).getDate();
}

// Gets the number of weekdays in a given month. For example in January 2020
// there there are 5 Saturdays and 4 Mondays. The offset is that of the next
// target weekday from the weekday at the first of the month. Assumes a date
// that is already reset to the first of the month.
export function getWeekdaysInMonth(date, weekday) {
  const offset = (7 - date.getDay() + weekday) % 7;
  return Math.ceil((getDaysInMonth(date) - offset) / 7);
}

function collectYearMonth(args) {
  if (isDate(args[0])) {
    args = [args[0].getFullYear(), args[0].getMonth()];
  }
  return args;
}

function getMethodUnit(unit) {
  const methodUnit = METHOD_NAMES[unit];
  if (!methodUnit) {
    throw new TypeError(`Unit "${unit}" is invalid`);
  }
  return methodUnit;
}

function preventMonthTraversal(date, targetMonth) {
  const val = date.getDate();
  if (val > 28) {
    const daysInTargetMonth = getDaysInMonth(date.getFullYear(), targetMonth);
    if (daysInTargetMonth < val) {
      callDateSet(date, 'date', daysInTargetMonth);
    }
  }
}
