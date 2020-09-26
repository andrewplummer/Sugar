// TRACK: https://github.com/tc39/ecma402/pull/345

export function getQuarter(date) {
  return Math.ceil((date.getMonth() + 1) / 3);
}
