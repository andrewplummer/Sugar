import { isString, isDate, isObject } from '../../util/typeChecks';
import { assertDate } from '../../util/assertions';
import { cloneDate } from '../../util/clone';
import { setIANATimeZone } from './timeZone';
import { normalizeProps } from './props';
import { updateDate } from './update';
import { parseDate } from './parsing';
import { getPropsPrecision } from './units';

export function createDate(input, options = {}) {
  const { from, explain, timeZone } = options;
  const date = from ? cloneDate(from) : new Date();

  let retVal;

  if (isString(input)) {
    const result = parseDate(input, date, options);
    if (result) {
      retVal = explain ? result : date;
    }
  } else {
    const props = normalizeProps(input || {});
    updateDate(date, props, true);
    if (timeZone) {
      // Note that when parsing a string, time zone resolution needs to
      // happen inside the parser as a number of other options contribute
      // to the final result, so need to handle this separately here.
      setIANATimeZone(date, timeZone);
    }
    if (explain) {
      const absProps = props;
      retVal = {
        date,
        absProps,
        precision: getPropsPrecision(absProps),
      };
    } else {
      retVal = date;
    }
  }

  return retVal || null;
}

export function createDateFromArgs(input, options) {
  if (isString(options)) {
    options = {
      locale: options,
    };
  }
  return createDate(input, options);
}

export function createDateFromRollup(dateArg) {
  let date;
  if (isDate(dateArg)) {
    date = cloneDate(dateArg);
  } else if (dateArg) {
    const { input, options } = collectRollupInput(dateArg);
    date = createDate(input, options);
  }
  assertDate(date);
  return date;
}

export function collectRollupInput(dateArg) {
  let input, options;
  if (isString(dateArg)) {
    input = dateArg;
  } else if (isObject(dateArg)) {
    // Unwrap rolled up object.
    const { input: i, ...rest } = dateArg;
    if (i) {
      input = i;
      options = rest;
    } else {
      input = rest;
    }
  }
  return {
    input,
    options,
  };
}
