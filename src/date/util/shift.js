import { assertInteger } from '../../util/assertions';
import { callDateGet, getDaysInMonth } from './helpers';
import { getUnitMultiplier, isTimeUnit } from './units';
import { resetByProps } from './reset';
import { updateDate } from './update';

export function shiftDateByUnit(date, unit, val) {
  return shiftDateByProps(date, { [unit]: val });
}

export function advanceDate(date, relProps, reset) {
  return shiftDateByProps(date, relProps, reset, 1);
}

export function rewindDate(date, relProps, reset) {
  return shiftDateByProps(date, relProps, reset, -1);
}

// When advancing a datetime, the date components MUST be set using the internal
// methods and the time MUST be set using a numeric delta.
//
// For date components this is because a time delta cannot be derived as the
// unit values vary. For example a month may be 28-31 days, years may be 365
// or 366 days, and even days may be 23-25 hours if they span a DST shift.
//
// Time components conversely must be set with a delta as the units have fixed
// values, however time notation itself is ambiguous. For example during a DST
// fallback in North American timezones there are two hours marked as 2:00am.
// When using setHours with such a date the first one will be chosen, which
// notably may cause a time shift even if setting to the same hour. During a
// DST jump forward, setting an hour of 2 will jump forward to 3:00am. This is
// fine when setting absolute hours, however if we are rewinding then we cannot
// arrive at 1:00am, which is an actual hour behind 3:00am.
//
// Note that this same jump will occur when setting negative minutes, seconds,
// and milliseconds as well, so all time components must be handled as a delta.

function shiftDateByProps(date, relProps, reset, dir = 1) {
  const { dateProps, timeDelta } = getResolvedProps(date, relProps, dir);

  if (dateProps) {
    updateDate(date, dateProps);
  }

  if (timeDelta) {
    date.setTime(date.getTime() + timeDelta * dir);
  }

  if (reset) {
    resetByProps(date, {
      ...relProps,
      ...dateProps,
    });
  }

  return date;
}

// Resolves relative props into absolute props for the date component and a
// relative delta in ms for the time component as a different strategy needs
// to be used for the date and time.
function getResolvedProps(date, relProps, dir) {

  // Clone the props to not mutate them.
  relProps = { ...relProps };

  if ('day' in relProps) {
    // Shifting by a "day" actually means shifting the date, so update the
    // property. If a "date" property already exists then prefer it.
    if (!('date' in relProps)) {
      relProps.date = relProps.day;
    }
    delete relProps.day;
  }

  if ('week' in relProps) {
    // Shifting by a "week" means shifting by 7 days, which needs to take
    // into account date shifts as well.
    assertInteger(relProps.week);
    relProps.date = (relProps.week * 7) + (relProps.date || 0);
    delete relProps.week;
  }

  let dateProps;
  let timeDelta = 0;

  for (let [unit, val] of Object.entries(relProps)) {
    assertInteger(val);
    if (isTimeUnit(unit)) {
      timeDelta += val * getUnitMultiplier(unit);
    } else {
      if (!dateProps) {
        dateProps = {};
      }
      const curVal = callDateGet(date, unit);
      val = curVal + val * dir;

      if (unit === 'date' && 'month' in dateProps) {
        // Date shifting relies on date methods optimistically allowing values
        // to be overshot, for example advancing 5 days on the 31st will result
        // in calling setDate with a value of 36. This is fine, however when a
        // month is also advanced it may fall on a day that does not exist, for
        // example advancing one month from January 31st into February.
        //
        // We are preventing this by setting the date to the last day of the
        // month as it is nearly always unintentional, however this will cause
        // an issue when advancing as the absolute date will be calculated from
        // the current one, which has not yet shifted, so we need to anticipate
        // this and compensate.
        const targetYear = dateProps.year || date.getFullYear();
        const daysInMonth = getDaysInMonth(targetYear, dateProps.month);
        if (daysInMonth < curVal) {
          val -= curVal - daysInMonth;
        }
      }

      dateProps[unit] = val;
    }
  }
  return {
    dateProps,
    timeDelta,
  };
}
