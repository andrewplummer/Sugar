import { isString, isDate, isObject } from '../../util/typeChecks';
import { assertDate } from '../../util/assertions';
import { cloneDate } from '../../util/clone';
import { setIANATimeZone } from './timeZone';
import { normalizeProps } from './props';
import { updateDate } from './update';
import { parseDate } from './parsing';
import { getPropsSpecificity } from './units';

export function createDate(input, options = {}) {
  const { from, timeZone, explain } = options;
  const date = from ? cloneDate(from) : new Date();

  let retVal;
  let hasZone;

  if (input == null) {
    retVal = date;
  } else if (isString(input)) {
    const result = parseDate(input, date, options);
    if (result) {
      retVal = explain ? result : date;
      hasZone = 'timeZoneOffset' in result.absProps;
    }
  } else {
    const props = normalizeProps(input);
    updateDate(date, props, true);
    if (explain) {
      const absProps = props;
      retVal = {
        date,
        absProps,
        specificity: getPropsSpecificity(absProps),
      };
    } else {
      retVal = date;
    }
  }

  if (!hasZone && timeZone) {
    setIANATimeZone(date, timeZone);
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
    date = dateArg;
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
