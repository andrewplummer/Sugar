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
    timeZone,
  });
  const props = formatter.formatToParts(date).reduce((props, part) => {
    const { type, value } = part;
    if (type !== 'literal') {
      props[type] = value;
    }
    return props;
  }, {});
  const { year, month, day, hour, minute, second } = props;
  const str = `${year}-${month}-${day}T${hour}:${minute}:${second}`;
  date.setTime(date.getTime() * 2 - new Date(str).getTime());
}
