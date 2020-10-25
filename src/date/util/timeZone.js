export function setTimeZoneOffset(date, val) {
  // Setting a timezone offset of 0 means adding the number of minutes
  // that is the difference between the value and the system time.
  date.setMinutes(date.getMinutes() - date.getTimezoneOffset() + val);
}

export function setIANATimeZone(date, timeZone) {
  const formatter = new Intl.DateTimeFormat('en', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hourCycle: 'h23',
    fractionalSecondDigits: 3,
  });
  const props = formatter.formatToParts(date).reduce((props, part) => {
    props[part.type] = part.value;
    return props;
  }, {});
  const { year, month, day, hour, minute, second, fractionalSecond: ms } = props;
  const str = `${year}-${month}-${day}T${hour}:${minute}:${second}.${ms}`;
  date.setTime(date.getTime() * 2 - new Date(str).getTime());
}
