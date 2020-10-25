let defaultTime;

mockTimeZone = (offset) => {
  // Mock both Intl.DateTimeFormat#format and Date#getTimezoneOffset
  Intl.DateTimeFormat.mockTimeZoneOffset(offset);
  Date.mockTimezoneOffset(offset);
};

resetTimeZone = () => {
  Intl.DateTimeFormat.mockTimeZoneOffset(null);
  Date.mockTimezoneOffset(null);
};

setSystemTime = (date) => {
  const time = date.getTime();
  if (!defaultTime) {
    defaultTime = time;
  }
  clock.setSystemTime(time);
};

resetSystemTime = () => {
  clock.setSystemTime(defaultTime);
};
