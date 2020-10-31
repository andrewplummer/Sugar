export function setTimeZoneOffset(date, val) {
  // Setting a timezone offset of 0 means adding the number of minutes
  // that is the difference between the value and the system time.
  date.setMinutes(date.getMinutes() - date.getTimezoneOffset() + val);
}

export function setIANATimeZone(date, timeZone) {
  const formatter = new Intl.DateTimeFormat('en', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hourCycle: 'h23',
    fractionalSecondDigits: 3,
    timeZone,
  });
  const props = {};
  for (let { type, value } of formatter.formatToParts(date)) {
    props[type] = value;
  }
  const { year, month, day, hour, minute, second, fractionalSecond: ms } = props;
  const str = `${year}-${month}-${day}T${hour}:${minute}:${second}.${ms}`;
  date.setTime(date.getTime() * 2 - new Date(str).getTime());
}
