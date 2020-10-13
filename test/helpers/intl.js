// TODO: get rid of some of those eslint helpers??

getLocalTimeZoneName = function(type) {
  const formatter = new Intl.DateTimeFormat('en', {
    timeZoneName: type,
  });
  const parts = formatter.formatToParts(new Date());
  const part = parts.find((p) => {
    return p.type === 'timeZoneName';
  });
  return part.value;
}

getIntlCollatedArray = function(locale, arr) {
  const collator = new Intl.Collator(locale);
  arr.sort((a, b) => {
    return collator.compare(a, b);
  });
  return arr;
}

// TODO: change to mock

withNumberFormatter = function(locale, fn) {
  fn(new Intl.NumberFormat(locale));
};
