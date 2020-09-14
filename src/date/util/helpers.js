import { setWeekday } from './weekdays';
import { getNormalizedUnit } from './units';

const METHOD_NAMES = {
  year: 'FullYear',
  month: 'Month',
  date: 'Date',
  day: 'Day',
  hours: 'Hours',
  minutes: 'Minutes',
  seconds: 'Seconds',
  milliseconds: 'Milliseconds',
};

export function callDateGet(date, unit) {
  return date[`get${getMethodName(unit)}`]();
}

export function callDateSet(date, unit, val, safe) {
  // "Safe" denotes not setting the date if the value is the same as what is
  // currently set. In theory this should be a noop, however it will cause
  // timezone shifts when in the middle of a DST fallback. This is unavoidable
  // as the notation itself is ambiguous (i.e. there are two "1:00ams" on
  // November 1st, 2015 in northern hemisphere timezones that follow DST),
  // however when advancing or rewinding dates this can throw off calculations
  // so avoiding this unintentional shifting on an opt-in basis.
  if (safe && val === callDateGet(date, unit, val)) {
    return;
  }
  const methodName = getMethodName(unit);
  if (methodName === 'Day') {
    setWeekday(date, val);
  } else {
    date[`set${methodName}`](val);
  }
}

function getMethodName(unit) {
  const methodName = METHOD_NAMES[getNormalizedUnit(unit)];
  if (!methodName) {
    throw new TypeError(`Unit "${unit}" is invalid`);
  }
  return methodName;
}
