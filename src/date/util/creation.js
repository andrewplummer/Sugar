import { setIANATimeZone } from './timeZone';
import { normalizeProps } from './props';
import { updateDate } from './update';
import { parseDate } from './parsing';
import { cloneDate } from '../../util/clone';
import { assertDate } from '../../util/assertions';
import { isString, isDate } from '../../util/typeChecks';

export function createDate(arg1, arg2) {
  const { input, options } = collectArgs(arg1, arg2);

  const { from, timeZone } = options;
  const date = from ? cloneDate(from) : new Date();

  let retVal;
  let hasZone;

  if (input == null) {
    retVal = date;
  } else if (isString(input)) {
    const result = parseDate(input, date, options);
    if (result) {
      retVal = options.explain ? result : date;
      hasZone = 'timeZoneOffset' in result.absProps;
    }
  } else {
    const props = normalizeProps(input);
    updateDate(date, props, true);
    retVal = date;
  }

  if (!hasZone && timeZone) {
    setIANATimeZone(date, timeZone);
  }

  return retVal || null;
}

export function assertOrCreateDate(date) {
  if (!isDate(date)) {
    date = createDate(date)
  }
  assertDate(date);
  return date;
}

function collectArgs(arg1, arg2) {
  let input, options;
  if (isString(arg1)) {
    input = arg1;
    if (isString(arg2)) {
      options = { locale: arg2 };
    } else {
      options = arg2;
    }
  } else if (arg2) {
    input = arg1;
    options = arg2;
  } else {
    // Unwrap rolled up object.
    const { input: i, ...rest } = arg1;
    if (i) {
      input = i;
      options = rest;
    } else {
      input = rest;
    }
  }
  options = options || {};
  return {
    input,
    options,
  };
}
