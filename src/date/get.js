import { isDate } from '../util/typeChecks';
import { assertDate } from '../util/assertions';
import { collectRollupInput, createDate } from './util/creation';

/**
 * Returns a new date using the first as a starting point.
 *
 * @extra This method is an alias that is equivalent to calling `Date.create`
 *   with the `from` option. For input that resolves to an absolute date, this
 *   will have no effect. For more, see `Date.create`.
 *
 * @param {Date} date - The reference date.
 * @param {Date|string|Object} d2 - The date to compare against. Can be any
 *   input accepted by `Date.create`.
 *
 * @returns {Date|null}
 *
 * @example
 *
 *   new Date(2020, 0).get('Monday') -> 2019-12-30
 *   new Date(2020, 0).get('Friday') -> 2020-01-03
 *   new Date(2021, 0).get('April') -> 2021-04-01
 *   new Date(2020, 0).get('an hour ago') -> 2019-12-31T23:00:00
 *
 **/
export default function get(date, d2) {
  assertDate(date);
  if (isDate(d2)) {
    return d2;
  }
  const { input, options } = collectRollupInput(d2);
  return createDate(input, {
    ...options,
    from: date,
  });
}
