let defaultTime;

mockTimeZone = (offset) => {
  // Mock both Intl.DateTimeFormat#format and Date#getTimezoneOffset
  Date.mockTimezoneOffset(offset);
  Intl.DateTimeFormat.mockTimeZoneOffset(offset);
};

resetTimeZone = () => {
  Date.mockTimezoneOffset(null);
  Intl.DateTimeFormat.mockTimeZoneOffset(null);
  Intl.DateTimeFormat.mockTimeZoneNames(null);
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
