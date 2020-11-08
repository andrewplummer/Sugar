(() => {

  function mockDateTimeFormat() {
    const DateTimeFormat = Intl.DateTimeFormat;

    let defaultLocale;
    let mockTimeZoneOffset;
    let mockTimeZoneNames;

    // Get and hold the internal offset in case it is mocked later.
    const stOffset = new Date(2020, 0).getTimezoneOffset();
    const dtOffset = new Date(2020, 6).getTimezoneOffset();

    function getInternalOffset(d) {
      d = d || new Date();
      const month = d.getMonth();
      const date = d.getDate();
      const hour = d.getHours();
      if (month > 2 && month < 10) {
        return dtOffset;
      } else if (month === 2) {
        return date > 8 || (date === 8 && hour >= 2) ? dtOffset : stOffset;
      } else if (month === 10) {
        return hour < 1 ? dtOffset : stOffset;
      } else {
        return stOffset;
      }
    }

    class MockDateTimeFormat extends DateTimeFormat {

      static mockDefaultLocale(locale) {
        defaultLocale = locale;
      }

      static mockTimeZoneOffset(offset) {
        mockTimeZoneOffset = offset;
      }

      static mockTimeZoneNames(set) {
        mockTimeZoneNames = set;
      }

      constructor(locale, options) {
        super(locale || defaultLocale, options);
      }

      formatToParts(date) {
        const options = this.resolvedOptions();
        if ('timeZone' in options && mockTimeZoneOffset != null) {
          let time = date ? date.getTime() : Date.now();
          // Remove the internal offset and further
          // add the offset of the mocked time zone.
          time -= (getInternalOffset(date) - mockTimeZoneOffset) * 60 * 1000;
          date = new Date(time);
        }
        let parts = super.formatToParts(date);
        if ('timeZoneName' in options && mockTimeZoneNames) {
          const style = options.timeZoneName;
          parts = parts.map((part) => {
            let { type, value } = part;
            if (type === 'timeZoneName') {
              value = mockTimeZoneNames[style];
              part = {
                type,
                value,
              }
            }
            return part;
          });
        }
        return parts;
      }

    }

    Intl.DateTimeFormat = MockDateTimeFormat;
  }

  mockDateTimeFormat();
})();
