import { isString, isDate } from '../../util/typeChecks';
import { assertDate } from '../../util/assertions';
import { cloneDate } from '../../util/clone';

import { setIANATimeZone } from './timeZone';
import { normalizeProps } from './props';
import { updateDate } from './update';
import { parseDate } from './parsing';
import { getPropsSpecificity } from './units';

export function createDate(arg1, arg2, forceExplain) {
  const { input, options } = collectArgs(arg1, arg2, forceExplain);

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

export function explainDateCreate(arg) {
  return createDate(arg, null, true);
}

export function assertOrCreateDate(arg) {
  let date;
  if (isDate(arg)) {
    date = arg;
  } else {
    date = createDate(arg);
  }
  assertDate(date);
  return date;
}

function collectArgs(arg1, arg2, forceExplain) {
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
  if (forceExplain) {
    options.explain = true;
  }
  return {
    input,
    options,
  };
}
