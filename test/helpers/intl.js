(function() {

  const formatToParts = Intl.DateTimeFormat.prototype.formatToParts;

  // TODO: change to mock

  withNumberFormatter = function(locale, fn) {
    fn(new Intl.NumberFormat(locale));
  };

  getIntlCollatedArray = function(locale, arr) {
    const collator = new Intl.Collator(locale);
    arr.sort((a, b) => {
      return collator.compare(a, b);
    });
    return arr;
  }

  mockTimeZoneName = function(mockZoneNames) {
    Intl.DateTimeFormat.prototype.formatToParts = function() {
      const { timeZoneName } = this.resolvedOptions();
      const value = mockZoneNames[timeZoneName];
      return [
        {
          type: 'timeZoneName',
          value,
        }
      ];
    }
  }

  releaseTimeZoneName = function() {
    Intl.DateTimeFormat.prototype.formatToParts = formatToParts;
  }

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

})();
