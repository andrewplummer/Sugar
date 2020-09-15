import { assertInteger } from '../../util/assertions';

export function updateDate(date, props, reset) {
  const entries = Object.entries(props);

  if (reset) {
    // Reset first to prevent accidentally traversing into a new month as
    // described below.
    let specificity = 0;
    for (let [unit] of entries) {
      specificity = Math.max(specificity, getUnitSpecificity(unit));
    }
    resetBySpecificity(date, specificity);
  }

  // There are two cases in which unintentional shifts may occur depending
  // on how date methods are applied. The first is when there are not enough
  // days in a month, shifting the date into the next month. The second is
  // DST shifts where an hour may not technically exist, for example 2am on
  // March 8th in northern hemisphere timezones that follow DST, where the hour
  // will shift to 3am. If a specific date or hour is intended then we need to
  // prevent these shifts.

  if ('date' in props) {
    // Resetting the date will help prevent traversal into a different
    // month, for example when setting { month: 1, date: 15 } on January 31.
    // Note that DST shifts will not cause traversal into a new day, so we
    // do not need to reset the hour here.
    callDateSet(date, 'date', 1);
  }

  // The order of operations is important as setting { month: 0: date: 31 }
  // on February 1 will produce different results depending on whether the
  // month or date is set first. Likewise setting { date: 7, hour: 2 } on
  // March 8 in a DST timezone will produce different results if hour or
  // date is set first.
  //
  // For values that fall within ranges correct for their unit, these should
  // be the only two cases where sorting is required, however date set methods
  // may also overshoot their boundaries or provide negative input which also
  // will cause shifts, for example { year: 2020, month: 36 }. For this reason
  // we need to sort in all cases from least specific -> most specific.
  entries.sort((a, b) => {
    return getUnitSpecificity(a[0]) - getUnitSpecificity(b[0]);
  });

  for (let [unit, val] of entries) {
    callDateSet(date, unit, val);
  }

  return date;
}

export function advanceDate(date, props, reset) {
  props = getPropsFromRelative(date, props, 1);
  updateDate(date, props, reset);
}

export function rewindDate(date, props, reset) {
  props = getPropsFromRelative(date, props, -1);
  updateDate(date, props, reset);
}

// Date method helpers

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

function callDateGet(date, unit) {
  return date[`get${getMethodUnit(unit)}`]();
}

function callDateSet(date, unit, val, safe) {
  assertInteger(val);

  // "Safe" denotes not setting the date if the value is the same as what is
  // currently set. In theory this should be a noop, however it will cause
  // timezone shifts when in the middle of a DST fallback. This is unavoidable
  // as the notation itself is ambiguous (ie. there are two "1:00ams" on
  // November 1st, 2015 in northern hemisphere timezones that follow DST),
  // however when advancing or rewinding dates this can throw off calculations
  // so avoiding this unintentional shifting on an opt-in basis.
  if (safe && val === callDateGet(date, unit, val)) {
    return;
  }
  if (unit === 'month') {
    // If intentionally setting the date to a specific month, prevent traversing
    // into a new month when not enough days are available. Do this by setting
    // the minimum value between the current date and the number of days in the
    // target month.
    preventMonthTraversal(date, val);
  }
  const methodUnit = getMethodUnit(unit);
  if (methodUnit === 'Day') {
    setWeekday(date, val);
  } else {
    date[`set${methodUnit}`](val);
  }
}

function setWeekday(date, val) {
  date.setDate(date.getDate() + (val - date.getDay()));
}

function getMethodUnit(unit) {
  const methodUnit = METHOD_NAMES[unit];
  if (!methodUnit) {
    throw new TypeError(`Unit "${unit}" is invalid`);
  }
  return methodUnit;
}

function preventMonthTraversal(date, targetMonth) {
  const dateVal = callDateGet(date, 'date');
  if (dateVal > 28) {
    const daysInTargetMonth = getDaysInMonth(date, targetMonth);
    if (daysInTargetMonth < dateVal) {
      callDateSet(date, 'date', daysInTargetMonth);
    }
  }
}

function getDaysInMonth(date, month) {
  const year = callDateGet(date, 'year');
  if (month == null) {
    month = callDateGet(date, 'month');
  }
  return 32 - callDateGet(new Date(year, month, 32), 'date');
}

// Advance/Rewind helpers

function getPropsFromRelative(date, relProps, dir) {
  const props = {};
  if ('day' in relProps) {
    relProps.date = relProps.day;
    delete relProps.day;
  }
  if ('week' in relProps) {
    assertInteger(relProps.week);
    relProps.date = (relProps.week * 7) + (relProps.date || 0);
    delete relProps.week;
  }
  for (let [unit, val] of Object.entries(relProps)) {
    assertInteger(val);
    const curVal = callDateGet(date, unit);
    val = curVal + val * dir;
    // Need to anticipate month traversal when not enough days and
    // shift the target days by the amount they will be shifted.
    // This is only required for relative as any other updates will
    // be setting an explicit date.
    if (unit === 'date' && 'month' in props) {
      const targetYear = props.year || callDateGet(date, 'year');
      const daysInMonth = getDaysInMonth(new Date(targetYear, props.month));
      if (daysInMonth < curVal) {
        val -= curVal - daysInMonth;
      }
    }
    props[unit] = val;
  }
  return props;
}

// Specificity helpers

const SPECIFICITY_INDEX = [
  'year',
  'month',
  'date',
  'hours',
  'minutes',
  'seconds',
  'milliseconds',
];

function getUnitSpecificity(unit) {
  if (unit === 'day') {
    unit = 'date';
  }
  return SPECIFICITY_INDEX.indexOf(unit);
}

function resetBySpecificity(date, specificity) {
  for (let i = specificity + 1; i < SPECIFICITY_INDEX.length; i++) {
    // Date reset value is 1, everything else is 0 index.
    const val = i === 2 ? 1 : 0;
    callDateSet(date, SPECIFICITY_INDEX[i], val);
  }
}
